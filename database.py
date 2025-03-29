"""
Database module for secure data management.

This module provides utilities for database connection, session management,
encryption/decryption of sensitive data, secure CRUD operations, and audit logging.
All operations follow HIPAA compliance requirements for healthcare data.
"""

import os
import logging
import json
import datetime
import uuid
from typing import Any, Dict, List, Optional, Type, TypeVar, Generic, Callable
from functools import wraps
from contextlib import contextmanager

from sqlalchemy import create_engine, Column, String, event, MetaData
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, scoped_session, Session
from sqlalchemy.pool import QueuePool
from sqlalchemy.exc import SQLAlchemyError

import base64
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("database.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Generic type for SQLAlchemy models
T = TypeVar('T')

# Database Configuration
DATABASE_URL = os.getenv('DATABASE_URL', 'sqlite:///./smart_med_assistant.db')
SECRET_KEY = os.getenv('SECRET_KEY')
SALT = os.getenv('ENCRYPTION_SALT', b'smart_med_assistant_salt')

if not SECRET_KEY:
    logger.warning("No SECRET_KEY provided, generating a temporary one. This is not secure for production!")
    SECRET_KEY = Fernet.generate_key().decode()

# Encryption Setup
def get_encryption_key(password: str, salt: bytes = SALT) -> bytes:
    """
    Derive an encryption key from a password and salt.
    
    Args:
        password: The password to derive the key from
        salt: The salt to use for key derivation
        
    Returns:
        bytes: The derived encryption key
    """
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        iterations=100000,
    )
    key = base64.urlsafe_b64encode(kdf.derive(password.encode()))
    return key


class Encryptor:
    """Handles encryption and decryption of sensitive data."""
    
    def __init__(self, key: str = SECRET_KEY):
        """
        Initialize the encryptor with an encryption key.
        
        Args:
            key: The encryption key to use. Defaults to the app's SECRET_KEY.
        """
        self.fernet = Fernet(key.encode() if isinstance(key, str) else key)
    
    def encrypt(self, data: str) -> str:
        """
        Encrypt a string.
        
        Args:
            data: The string to encrypt
            
        Returns:
            str: The encrypted data as a base64-encoded string
        """
        if not data:
            return data
        return self.fernet.encrypt(data.encode()).decode()
    
    def decrypt(self, encrypted_data: str) -> str:
        """
        Decrypt an encrypted string.
        
        Args:
            encrypted_data: The encrypted data as a base64-encoded string
            
        Returns:
            str: The decrypted string
        """
        if not encrypted_data:
            return encrypted_data
        return self.fernet.decrypt(encrypted_data.encode()).decode()


# SQLAlchemy Setup
engine = create_engine(
    DATABASE_URL,
    poolclass=QueuePool,
    pool_size=5,
    max_overflow=10,
    pool_timeout=30,
    pool_recycle=3600,
    connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
)

# Create a custom metadata with naming conventions
metadata = MetaData(naming_convention={
    "ix": "ix_%(column_0_label)s",
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s"
})

Base = declarative_base(metadata=metadata)

# Create a session factory
session_factory = sessionmaker(bind=engine, expire_on_commit=False)
db_session = scoped_session(session_factory)

# Audit Log Model
class AuditLog(Base):
    """Model for storing audit logs of database operations."""
    
    __tablename__ = "audit_logs"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    timestamp = Column(String, default=lambda: datetime.datetime.now().isoformat())
    user_id = Column(String)
    action = Column(String)
    table_name = Column(String)
    record_id = Column(String)
    details = Column(String)
    
    def __repr__(self) -> str:
        return f"<AuditLog(id='{self.id}', action='{self.action}', table='{self.table_name}')>"


# Session Management
@contextmanager
def get_db_session() -> Session:
    """
    Provide a transactional scope around a series of operations.
    
    Yields:
        Session: A SQLAlchemy session
        
    Raises:
        Exception: Any exception that occurs during the session
    """
    session = db_session()
    try:
        yield session
        session.commit()
    except Exception as e:
        session.rollback()
        logger.error(f"Session error: {str(e)}")
        raise
    finally:
        session.close()


def log_audit(
    session: Session, 
    user_id: str, 
    action: str, 
    table_name: str, 
    record_id: str, 
    details: Optional[Dict[str, Any]] = None
) -> None:
    """
    Create an audit log entry.
    
    Args:
        session: SQLAlchemy session
        user_id: ID of the user performing the action
        action: Type of action (CREATE, READ, UPDATE, DELETE)
        table_name: Name of the table being modified
        record_id: ID of the record being modified
        details: Additional details about the operation
    """
    audit = AuditLog(
        user_id=user_id,
        action=action,
        table_name=table_name,
        record_id=record_id,
        details=json.dumps(details) if details else None
    )
    session.add(audit)


def with_audit(action: str):
    """
    Decorator to add audit logging to CRUD operations.
    
    Args:
        action: The type of action being performed (CREATE, READ, UPDATE, DELETE)
        
    Returns:
        Callable: Decorated function with audit logging
    """
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            user_id = kwargs.get('user_id', 'system')
            table_name = kwargs.get('__tablename__', args[0].__tablename__ if args and hasattr(args[0], '__tablename__') else 'unknown')
            record_id = kwargs.get('id', getattr(args[0], 'id', None) if args else None)
            
            details = {
                'args': str(args),
                'kwargs': str({k: v for k, v in kwargs.items() if k != 'session'})
            }
            
            session = kwargs.get('session')
            if not session and 'db_session' in kwargs:
                session = kwargs['db_session']
                
            result = func(*args, **kwargs)
            
            if session:
                log_audit(
                    session=session,
                    user_id=user_id,
                    action=action,
                    table_name=table_name,
                    record_id=str(record_id) if record_id else 'batch',
                    details=details
                )
            
            return result
        return wrapper
    return decorator


class DatabaseRepository(Generic[T]):
    """
    Generic repository for database operations with built-in encryption and audit logging.
    
    Type Parameters:
        T: A SQLAlchemy model class
    """
    
    def __init__(self, model_class: Type[T], sensitive_fields: Optional[List[str]] = None):
        """
        Initialize the repository.
        
        Args:
            model_class: The SQLAlchemy model class
            sensitive_fields: List of field names that contain sensitive data and should be encrypted
        """
        self.model_class = model_class
        self.sensitive_fields = sensitive_fields or []
        self.encryptor = Encryptor()
        
    def _encrypt_sensitive_fields(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Encrypt sensitive fields in the data.
        
        Args:
            data: Dictionary containing data to be stored
            
        Returns:
            Dict[str, Any]: Data with sensitive fields encrypted
        """
        for field in self.sensitive_fields:
            if field in data and data[field]:
                data[field] = self.encryptor.encrypt(str(data[field]))
        return data
    
    def _decrypt_sensitive_fields(self, model: T) -> T:
        """
        Decrypt sensitive fields in a model instance.
        
        Args:
            model: A SQLAlchemy model instance
            
        Returns:
            T: The model with sensitive fields decrypted
        """
        for field in self.sensitive_fields:
            value = getattr(model, field, None)
            if value:
                setattr(model, field, self.encryptor.decrypt(value))
        return model
    
    @with_audit("CREATE")
    def create(self, data: Dict[str, Any], user_id: str, session: Optional[Session] = None) -> T:
        """
        Create a new record.
        
        Args:
            data: Dictionary containing data for the new record
            user_id: ID of the user performing the action
            session: SQLAlchemy session (optional)
            
        Returns:
            T: The created record
            
        Raises:
            SQLAlchemyError: If a database error occurs
        """
        data = self._encrypt_sensitive_fields(data)
        
        try:
            with get_db_session() as db:
                actual_session = session or db
                instance = self.model_class(**data)
                actual_session.add(instance)
                actual_session.flush()
                
                # If we're using our own session, commit it
                if not session:
                    actual_session.commit()
                    
                return self._decrypt_sensitive_fields(instance)
        except SQLAlchemyError as e:
            logger.error(f"Error creating {self.model_class.__name__}: {str(e)}")
            raise
    
    @with_audit("READ")
    def get_by_id(self, id: Any, user_id: str, session: Optional[Session] = None) -> Optional[T]:
        """
        Get a record by ID.
        
        Args:
            id: The ID of the record to retrieve
            user_id: ID of the user performing the action
            session: SQLAlchemy session (optional)
            
        Returns:
            Optional[T]: The retrieved record, or None if not found
            
        Raises:
            SQLAlchemyError: If a database error occurs
        """
        try:
            with get_db_session() as db:
                actual_session = session or db
                instance = actual_session.query(self.model_class).get(id)
                
                if instance:
                    return self._decrypt_sensitive_fields(instance)
                return None
        except SQLAlchemyError as e:
            logger.error(f"Error retrieving {self.model_class.__name__} with id {id}: {str(e)}")
            raise
    
    @with_audit("UPDATE")
    def update(self, id: Any, data: Dict[str, Any], user_id: str, session: Optional[Session] = None) -> Optional[T]:
        """
        Update a record.
        
        Args:
            id: The ID of the record to update
            data: Dictionary containing the updated data
            user_id: ID of the user performing the action
            session: SQLAlchemy session (optional)
            
        Returns:
            Optional[T]: The updated record, or None if not found
            
        Raises:
            SQLAlchemyError: If a database error occurs
        """
        data = self._encrypt_sensitive_fields(data)
        
        try:
            with get_db_session() as db:
                actual_session = session or db
                instance = actual_session.query(self.model_class).get(id)
                
                if not instance:
                    return None
                
                for key, value in data.items():
                    if hasattr(instance, key):
                        setattr(instance, key, value)
                
                actual_session.flush()
                
                # If we're using our own session, commit it
                if not session:
                    actual_session.commit()
                
                return self._decrypt_sensitive_fields(instance)
        except SQLAlchemyError as e:
            logger.error(f"Error updating {self.model_class.__name__} with id {id}: {str(e)}")
            raise
    
    @with_audit("DELETE")
    def delete(self, id: Any, user_id: str, session: Optional[Session] = None) -> bool:
        """
        Delete a record.
        
        Args:
            id: The ID of the record to delete
            user_id: ID of the user performing the action
            session: SQLAlchemy session (optional)
            
        Returns:
            bool: True if the record was deleted, False if not found
            
        Raises:
            SQLAlchemyError: If a database error occurs
        """
        try:
            with get_db_session() as db:
                actual_session = session or db
                instance = actual_session.query(self.model_class).get(id)
                
                if not instance:
                    return False
                
                actual_session.delete(instance)
                
                # If we're using our own session, commit it
                if not session:
                    actual_session.commit()
                
                return True
        except SQLAlchemyError as e:
            logger.error(f"Error deleting {self.model_class.__name__} with id {id}: {str(e)}")
            raise
    
    @with_audit("READ")
    def list_all(self, user_id: str, session: Optional[Session] = None) -> List[T]:
        """
        List all records.
        
        Args:
            user_id: ID of the user performing the action
            session: SQLAlchemy session (optional)
            
        Returns:
            List[T]: List of all records
            
        Raises:
            SQLAlchemyError: If a database error occurs
        """

