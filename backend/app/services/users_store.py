from  werkzeug.security import check_password_hash
from datetime import datetime, timedelta
from pymongo import MongoClient
from ..models.user import User
from ..utils.constants import MONGO_URI, JWT_ENCODING_KEY, TOKEN_VALIDITY, USERS_DB, USERS_COLLECTION, GORSE_API
import requests
import uuid
import jwt

# Creates a user in the system and returns its auth token
def create_user(user: User, password, labels = [], suscribe = []):
    if (user.email == None or user.email == '' or password == None or password == ''):
        raise IncorrectCredentials()
    client = MongoClient(MONGO_URI)
    db = client[USERS_DB]
    users = db[USERS_COLLECTION]
    newUserId = str(uuid.uuid4())
    usr = users.find_one({ "email": user.email })
    if usr != None: 
        raise UserExists()
    user.setId(newUserId)
    user.setPassword(password)
    users.insert_one(user.toCollectionEntry())

    # Create user for gorse - set the id of the user as userId in gorse
    gorse_users = db['gorse_users']
    gorse_users.insert_one({
        "userid": newUserId,
        "comment": "",
        "labels": labels,
        "subscribe": suscribe
    })

    token = build_token(user)
    return RegisterResult(True, token)

# Validates email, password and returns it's auth token if validated correctly
def login(email, password):
    client = MongoClient(MONGO_URI)
    db = client[USERS_DB]
    users = db[USERS_COLLECTION]
    user = users.find_one({ "email": email })

    if user == None or not check_password_hash(user["password"], password):
        raise IncorrectCredentials()
    
    return build_token(User(
        id = user["id"],
        email = user["email"]
    ));

# Builds a jwt bearer token
def build_token(user: User):
    return jwt.encode({
            'userid': user.id,
            'email': user.email,
            'exp' : datetime.utcnow() + timedelta(minutes = int(TOKEN_VALIDITY))
        }, JWT_ENCODING_KEY)


# RESULT CLASSES

class RegisterResult:
    def __init__(self, result: bool, token: str) -> None:
        self.result = result
        self.token = token

# EXCEPTIONS

class UserExists(Exception):
    def __init__(self, *args: object) -> None:
        super().__init__(*args)

class IncorrectCredentials(Exception):
    def __init__(self, *args: object) -> None:
        super().__init__(*args)
