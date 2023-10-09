from flask import Blueprint
from flask import request

movies = Blueprint("movies", __name__)


def get_args():
    n = request.args.get("n", default=10)
    offset = request.args.get("offset", default=0)
    user_id = request.args.get("user-id", default=None)
    return n, offset, user_id


@movies.get("/")
def get_movies():
    result = {"message": "Enjoy the movies!"}
    return result, 200


@movies.get("/popular")
def get_popular():
    n, offset, user_id = get_args()

    result = {"message": f"Enjoy the popular movies {n} {offset} {user_id}!"}
    return result, 200


@movies.get("/popular/<genre>")
def get_popular_by_genre(genre):
    n, offset, user_id = get_args()

    result = {"message": f"Enjoy the movies popular {genre} movies!"}
    return result, 200


@movies.get("/latest")
def get_latest():
    n, offset, user_id = get_args()

    result = {"message": "Enjoy the latest movies!"}
    return result, 200


@movies.get("/latest/<genre>")
def get_latest_by_genre(genre):
    n, offset, user_id = get_args()

    result = {"message": f"Enjoy the latest {genre} movies!"}
    return result, 200
