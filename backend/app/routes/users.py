import os

from flask import Blueprint, request
from pymongo import MongoClient

from ..services.users_store import UserNotFound
from ..utils.constants import MONGO_URI, USERS_COLLECTION, USERS_DB

users = Blueprint("users", __name__)


@users.get("/")
def get_users():
    print(f"Your api key {os.environ['TMDB_API_KEY']}")
    result = {"message": "Users endpoint!"}
    return result, 200


# Watchlist endpoints
@users.get("/<user_id>/watchlist")
def get_watchlist(user_id):
    try:
        client = MongoClient(MONGO_URI)
        db = client[USERS_DB]
        users = db[USERS_COLLECTION]

        usr = users.find_one({"user_id": user_id})

        return {"result": True, "watchlist": usr["watchlist"]}, 200
    except UserNotFound:
        return {"message": "User not found"}, 404
    except:
        return {"message": "Something went wrong"}, 500


@users.post("/<user_id>/watchlist/<movie_id>")
def add_to_watchlist(user_id, movie_id):
    try:
        client = MongoClient(MONGO_URI)
        db = client[USERS_DB]
        users = db[USERS_COLLECTION]

        usr = users.find_one({"id": user_id})
        if not usr:
            raise UserNotFound

        if movie_id in usr["watchlist"]:
            return {"result": False, "message": "Movie already in watchlist"}, 400

        users.find_one_and_update(
            {"id": user_id}, {"$push": {"watchlist": movie_id}}, upsert=True
        )

        return {
            "result": True,
            "watchlist": usr["watchlist"] + [movie_id],
            "message": "Movie added to watchlist successfully",
        }, 200
    except UserNotFound:
        return {"message": "User not found"}, 404
    except:
        return {"message": "Something went wrong"}, 500


@users.delete("/<user_id>/watchlist/<movie_id>")
def delete_from_watchlist(user_id, movie_id):
    try:
        client = MongoClient(MONGO_URI)
        db = client[USERS_DB]
        users = db[USERS_COLLECTION]

        usr = users.find_one({"id": user_id})
        if not usr:
            raise UserNotFound

        if movie_id not in usr["watchlist"]:
            return {"result": False, "message": "Movie not in watchlist"}, 400

        users.update_one({"id": user_id}, {"$pull": {"watchlist": movie_id}})

        watchlist = usr["watchlist"]
        watchlist.remove(movie_id)

        return {
            "result": True,
            "watchlist": watchlist,
            "message": "Movie removed from watchlist successfully",
        }, 200
    except UserNotFound:
        return {"message": "User not found"}, 404
    except:
        return {"message": "Something went wrong"}, 500
