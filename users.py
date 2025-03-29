"""
User model for the MedTrack application.

This module defines the User document schema for MongoDB using mongoengine.
"""
from datetime import datetime
from typing import Optional

from mongoengine import (
    Document,
    StringField,
    DateTimeField,
    DateField,
    EmailField,
)

class User(Document):
    """
    User model representing application users
    
    Attributes:
        username (str): Unique username for the user
        email (str): Unique email address for the user
        password_hash (str): Hashed password for secure storage
        first_name (str,optional): User's first name
        last_name (str, optional): User's last name
        phone_number (str, optional): User's contact phone number
        date_of_birth (datetime.date, optional): User's date of birth
        created_at (datetime): Timestamp when the user was created
        updated_at (datetime): Timestamp when the user was last updated
    """
    
    #Required fields
    username = StringField(required=True, unique=True, max_length=50)
    email = EmailField(required=True, unique=True)
    password_hash = StringField(required=True)
    
    #Optional personal info
    first_name = StringField(max_length=50)
    last_name = StringField(max_length=50)
    phone_number = StringField(max_length=20)
    date_of_birth = DateField()
    
    #Timestamps
    created_at = DateTimeField(default=datetime.utcnow)
    updated_at = DateTimeField(default=datetime.utcnow)
    
    #Met info for the document
    meta = {
        'collection': 'users',
        'indexes': [
            'username',
            'email',
        ],
    }
    
    def __repr__(self) -> str:
        """Return a string representation of the User. """
        return f"<User: {self.username}>"
    
    def full_name(self) -> str:
        """
        Return the user's full name.
        
        Returns:
            str: Full name of the user (first_name + last_name)
        """
        if self.first_name and self.last_name:
            return f"{self.first_name} {self.last_name}"
        elif self.first_name:
            return self.first_name
        elif self.last_name:
            return self.last_name
        return ""
    
    def to_dict(self) -> dict:
        """
        Convert User document to dictionary.
        
        Returns:
            dict: Dictionary rep of the user
        """
        return {
            "id": str(self.id),
            "username": self.username,
            "email": self.email,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "phone_number": self.phone_number,
            "date_of_birth": self.date_of_birth.isoformat() if self.date_of_birth else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }