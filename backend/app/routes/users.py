from flask import Blueprint
import os

users = Blueprint("users", __name__)


@users.get("/")
def get_users():
    print(f"Your api key {os.environ['TMDB_API_KEY']}")
    result = {"message": "Users endpoint!"}
    return result, 200
