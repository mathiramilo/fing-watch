from flask import Blueprint

movies = Blueprint("movies", __name__)


@movies.get("/")
def get_movies():
    result = {"message": "Enjoy the movies!"}
    return result, 200
