import traceback

from flask import Blueprint, request

from ..models.user import User
from ..services.users_store import IncorrectCredentials, UserExists, create_user, login

auth = Blueprint("auth", __name__)


@auth.post("/sign-up")
def sign_up():
    try:
        content = request.get_json()
        print(content)
        result = create_user(User(email=content["email"]), content["password"])
        if result.result:
            return {"result": True, "token": result.token}, 200

    except UserExists:
        return {
            "result": False,
            "error": "There is an existing account with this email",
        }, 400
    except IncorrectCredentials:
        return {"result": False, "error": "Invalid credentials"}, 400
    except:
        traceback.print_exc()
        return {"result": False, "error": "Something went wrong"}, 500


@auth.post("/sign-in")
def sign_in():
    try:
        content = request.get_json()
        email = content["email"]
        password = content["password"]
        token = login(email, password)
        return {"result": True, "token": token}, 200

    except IncorrectCredentials:
        return {
            "result": False,
            "WWW-Authenticate": "Invalid credentials",
            "error": "Invalid Credentials",
        }, 401
    except:
        traceback.print_exc()
        return {"result": False, "error": "Something went wrong"}, 500
