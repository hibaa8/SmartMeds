"""
Data models for the Smart Medication Assistant application.

This module defines both SQLAlchemy models for database interaction and
Pydantic models for request/response validation.
"""

from datetime import datetime, date, time
from typing import List, Optional, Dict, Any
from enum import Enum
import uuid

from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Date, Time, ForeignKey, Text, Enum as SQLAEnum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from pydantic import BaseModel, Field, EmailStr, validator

# SQLAlchemy setup
Base = declarative_base()


# SQLAlchemy Models
class User(Base):
    """
    User model for storing authentication and profile information.
    
    This model includes personal details, authentication information, 
    and relationships to prescriptions.
    """
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(100), nullable=False)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    date_of_birth = Column(Date, nullable=False)
    phone_number = Column(String(20))
    address = Column(String(200))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    prescriptions = relationship("Prescription", back_populates="user")
    dose_trackers = relationship("DoseTracker", back_populates="user")


class Physician(Base):
    """
    Physician model for storing doctor information.
    
    This model includes contact details and professional information
    about doctors who prescribe medications.
    """
    __tablename__ = "physicians"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    specialty = Column(String(100))
    license_number = Column(String(50), nullable=False, unique=True)
    email = Column(String(100), unique=True)
    phone_number = Column(String(20), nullable=False)
    address = Column(String(200))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    prescriptions = relationship("Prescription", back_populates="physician")


class Pharmacy(Base):
    """
    Pharmacy model for storing pharmacy information.
    
    This model includes contact details and location information
    about pharmacies where prescriptions are filled.
    """
    __tablename__ = "pharmacies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    license_number = Column(String(50), nullable=False, unique=True)
    email = Column(String(100), unique=True)
    phone_number = Column(String(20), nullable=False)
    address = Column(String(200), nullable=False)
    hours_of_operation = Column(String(200))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    prescriptions = relationship("Prescription", back_populates="pharmacy")


class FrequencyType(str, Enum):
    """Enum for prescription frequency types."""
    DAILY = "daily"
    TWICE_DAILY = "twice_daily"
    THREE_TIMES_DAILY = "three_times_daily"
    FOUR_TIMES_DAILY = "four_times_daily"
    WEEKLY = "weekly"
    BIWEEKLY = "biweekly"
    MONTHLY = "monthly"
    AS_NEEDED = "as_needed"
    CUSTOM = "custom"


class Prescription(Base):
    """
    Prescription model for storing medication information.
    
    This model includes details about medications, dosages, frequencies,
    and renewal information, as well as relationships to users, physicians,
    and pharmacies.
    """
    __tablename__ = "prescriptions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    physician_id = Column(Integer, ForeignKey("physicians.id"), nullable=False)
    pharmacy_id = Column(Integer, ForeignKey("pharmacies.id"))
    
    name = Column(String(100), nullable=False)
    description = Column(Text)
    dosage = Column(Float, nullable=False)
    dosage_unit = Column(String(20), nullable=False)  # mg, ml, etc.
    frequency_type = Column(SQLAEnum(FrequencyType), nullable=False)
    frequency_custom = Column(String(100))  # For custom frequency descriptions
    times_per_day = Column(Integer)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date)
    renewal_date = Column(Date)
    refills_allowed = Column(Integer, default=0)
    refills_remaining = Column(Integer, default=0)
    instructions = Column(Text)
    side_effects = Column(Text)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="prescriptions")
    physician = relationship("Physician", back_populates="prescriptions")
    pharmacy = relationship("Pharmacy", back_populates="prescriptions")
    dose_trackers = relationship("DoseTracker", back_populates="prescription")


class AdherenceStatus(str, Enum):
    """Enum for dose tracker adherence status."""
    TAKEN = "taken"
    MISSED = "missed"
    LATE = "late"
    SKIPPED = "skipped"


class DoseTracker(Base):
    """
    DoseTracker model for tracking medication intake and adherence.
    
    This model records when medications were taken, schedules for future doses,
    and adherence information.
    """
    __tablename__ = "dose_trackers"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    prescription_id = Column(Integer, ForeignKey("prescriptions.id"), nullable=False)
    
    scheduled_time = Column(DateTime, nullable=False)
    taken_time = Column(DateTime)
    status = Column(SQLAEnum(AdherenceStatus), default=AdherenceStatus.MISSED)
    notes = Column(Text)
    
    # For recurring doses
    dose_number = Column(Integer)  # e.g., 1st dose of the day
    total_daily_doses = Column(Integer)  # e.g., 3 total doses per day
    
    # For adherence tracking
    adherence_score = Column(Float)  # Calculated field based on timing
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="dose_trackers")
    prescription = relationship("Prescription", back_populates="dose_trackers")


# Pydantic Models for API Request/Response

# User models
class UserBase(BaseModel):
    """Base Pydantic model for User data."""
    username: str
    email: EmailStr
    first_name: str
    last_name: str
    date_of_birth: date
    phone_number: Optional[str] = None
    address: Optional[str] = None


class UserCreate(UserBase):
    """Pydantic model for creating a new User."""
    password: str


class UserUpdate(BaseModel):
    """Pydantic model for updating User information."""
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone_number: Optional[str] = None
    address: Optional[str] = None
    password: Optional[str] = None


class UserResponse(UserBase):
    """Pydantic model for User API responses."""
    id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


# Physician models
class PhysicianBase(BaseModel):
    """Base Pydantic model for Physician data."""
    first_name: str
    last_name: str
    specialty: Optional[str] = None
    license_number: str
    email: Optional[EmailStr] = None
    phone_number: str
    address: Optional[str] = None


class PhysicianCreate(PhysicianBase):
    """Pydantic model for creating a new Physician."""
    pass


class PhysicianUpdate(BaseModel):
    """Pydantic model for updating Physician information."""
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    specialty: Optional[str] = None
    email: Optional[EmailStr] = None
    phone_number: Optional[str] = None
    address: Optional[str] = None


class PhysicianResponse(PhysicianBase):
    """Pydantic model for Physician API responses."""
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


# Pharmacy models
class PharmacyBase(BaseModel):
    """Base Pydantic model for Pharmacy data."""
    name: str
    license_number: str
    email: Optional[EmailStr] = None
    phone_number: str
    address: str
    hours_of_operation: Optional[str] = None


class PharmacyCreate(PharmacyBase):
    """Pydantic model for creating a new Pharmacy."""
    pass


class PharmacyUpdate(BaseModel):
    """Pydantic model for updating Pharmacy information."""
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone_number: Optional[str] = None
    address: Optional[str] = None
    hours_of_operation: Optional[str] = None


class PharmacyResponse(PharmacyBase):
    """Pydantic model for Pharmacy API responses."""
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


# Prescription models
class PrescriptionBase(BaseModel):
    """Base Pydantic model for Prescription data."""
    physician_id: int
    pharmacy_id: Optional[int] = None
    name: str
    description: Optional[str] = None
    dosage: float
    dosage_unit: str
    frequency_type: FrequencyType
    frequency_custom: Optional[str] = None
    times_per_day: Optional[int] = None
    start_date: date
    end_date: Optional[date] = None
    renewal_date: Optional[date] = None
    refills_allowed: int = 0
    refills_remaining: int = 0
    instructions: Optional[str] = None
    side_effects: Optional[str] = None


class PrescriptionCreate(PrescriptionBase):
    """Pydantic model for creating a new Prescription."""
    user_id: int


class PrescriptionUpdate(BaseModel):
    """Pydantic model for updating Prescription information."""
    physician_id: Optional[int] = None
    pharmacy_id: Optional[int] = None
    name: Optional[str] = None
    description: Optional[str] = None
    dosage: Optional[float] = None
    dosage_unit: Optional[str] = None
    frequency_type: Optional[FrequencyType] = None
    frequency_custom: Optional[str] = None
    times_per_day: Optional[int] = None
    end_date: Optional[date] = None
    renewal_date: Optional[date] = None
    refills_allowed: Optional[int] = None
    refills_remaining: Optional[int] = None
    instructions: Optional[str] = None
    side_effects: Optional[str] = None
    is_active: Optional[bool] = None


class PrescriptionResponse(PrescriptionBase):
    """Pydantic model for Prescription API responses."""
    id: int
    user_id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime
    
    # Include related entities
    physician: Optional[PhysicianResponse] = None
    pharmacy: Optional[PharmacyResponse] = None

    class Config:
        orm_mode = True


# DoseTracker models
class DoseTrackerBase(BaseModel):
    """Base Pydantic model for DoseTracker data."""
    prescription_id: int
    scheduled_time: datetime
    taken_time: Optional[datetime] = None
    status: AdherenceStatus = AdherenceStatus.MISSED
    notes: Optional[str] = None
    dose_number: Optional[int] = None
    total_daily_doses: Optional[int] = None


class DoseTrackerCreate(DoseTrackerBase):
    """Pydantic model for creating a new DoseTracker entry."""
    user_id: int


class DoseTrackerUpdate(BaseModel):
    """Pydantic model for updating DoseTracker information."""
    taken_time: Optional[datetime] = None
    status: Optional[AdherenceStatus] = None
    notes: Optional[str] = None
    adherence_score: Optional[float] = None


class DoseTrackerResponse(DoseTrackerBase):
    """Pydantic model for DoseTracker API responses."""
    id: int
    user_id: int
    adherence_score: Optional[float] = None
    created_at: datetime
    updated_at: datetime
    
    # Include related entities
    prescription: Optional[PrescriptionResponse] = None

    class Config:
        orm_mode = True


# Summary models for dashboard views
class AdherenceSummary(BaseModel):
    """Summary model for medication adherence statistics."""
    total_doses: int
    doses_taken: int
    doses_missed: int
    doses_late: int
    doses_skipped: int
    adherence_percentage: float
    streak_days: int
    

class PrescriptionSummary(BaseModel):
    """Summary model for prescription overview."""
    active_prescriptions: int
    prescriptions_needing_renewal: int
    prescriptions_expiring_soon: List[PrescriptionResponse]

