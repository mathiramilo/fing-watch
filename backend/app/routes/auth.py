from flask import Blueprint, request
from ..services.users_store import create_user, login, UserExists, IncorrectCredentials
from ..models.user import User
import traceback 

auth = Blueprint("auth", __name__)

@auth.post("/sign-up")
def sign_up():
    try:
        content = request.get_json()
        result = create_user(User(
            username = content["username"],
            name = content["name"]
        ), content["password"])
        if result.result:
            return { "result": True, "token": result.token }, 200
        
    except UserExists:
        return { "error": "Usuario ya registrado" }, 400
    
    except:
        traceback.print_exc()
        return { "error": "Algo salio mal" }, 500

@auth.post("/sign-in")
def sign_in():
    try:
        content = request.get_json()
        username = content["username"]
        password = content["password"]
        token = login(username, password)
        return { "token": token }, 200
    
    except IncorrectCredentials:
        return {"WWW-Authenticate": "incorrect credentials"}, 401
    
    except:
        traceback.print_exc()
        return { "error": "Algo salio mal" }, 500
