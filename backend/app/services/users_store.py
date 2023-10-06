from  werkzeug.security import check_password_hash
from datetime import datetime, timedelta
from pymongo import MongoClient
from ..models.user import User
from ..utils.constants import MONGODB_HOST, MONGODB_PORT, JWT_ENCODING_KEY
import uuid
import jwt

# Creates a user in the system and returns its auth token
def create_user(user: User, password):
    client = MongoClient(MONGODB_HOST, MONGODB_PORT)
    db = client.flask_db
    users = db.get_collection("users")
    usr = users.find_one({ "username": user.username })
    if usr != None: 
        raise UserExists()
    user.setId(str(uuid.uuid4()))
    user.setPassword(password)
    users.insert_one(user.toCollectionEntry())
    token = build_token(user)
    return RegisterResult(True, token)

# Validates username, password and returns it's auth token if validated correctly
def login(username, password):
    client = MongoClient('localhost', 27017)
    db = client.flask_db
    users = db.get_collection("users")
    user = users.find_one({ "username": username })

    if user == None or not check_password_hash(user["password"], password):
        raise IncorrectCredentials()
    
    return build_token(User(
        id = user["id"],
        username = user["username"],
        name = user["name"]
    ));

# Builds a jwt bearer token
def build_token(user: User):
    return jwt.encode({
            'userid': user.id,
            'username': user.username,
            'exp' : datetime.utcnow() + timedelta(minutes = 30)
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
