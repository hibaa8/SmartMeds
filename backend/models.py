from pymongo import MongoClient
import bcrypt
from config import MONGO_URI

client = MongoClient(MONGO_URI)
db = client.medApp  # Database Name
users_collection = db.User  # Users Collection
prescription_collection = db.Prescription