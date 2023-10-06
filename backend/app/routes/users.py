from flask import Blueprint

users = Blueprint("users", __name__)


@users.get("/")
def get_users():
    result = {"message": "Users endpoint!"}
    return result, 200
