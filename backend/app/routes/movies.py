from flask import Blueprint
from flask import request
from ..models import movie
import pymongo
import requests
from ..utils.constants import GORSE_API, MONGO_URI


movies = Blueprint("movies", __name__)


def process_request(endpoint):
    parms = {parm: request.args.get(parm) for parm in request.args}

    resp = requests.get(GORSE_API + endpoint, params=parms)
    if not resp.ok:
        return {"message": "Error"}, 404  # TODO: ???

    # get movies id from gorse
    movies_ids = [item["Id"] for item in resp.json()]

    with pymongo.MongoClient(MONGO_URI) as client:
        result = movie.get_movies(client, movies_ids)

    return result, 200


@movies.get("/popular")
def get_popular():
    return process_request("/popular")


@movies.get("/popular/<genre>")
def get_popular_by_genre(genre):
    return process_request(f"/popular/{genre}")


@movies.get("/latest")
def get_latest():
    return process_request("/latest")


@movies.get("/latest/<genre>")
def get_latest_by_genre(genre):
    return process_request(f"/latest/{genre}")


@movies.get("/neighbors/<tmdb_id>")
def get_neighbors(tmdb_id):
    return process_request(f"/item/{tmdb_id}/neighbors")


@movies.get("/neighbors/<tmdb_id>/<genre>")
def get_neighbors_by_genre(tmdb_id, genre):
    return process_request(f"/item/{tmdb_id}/neighbors/{genre}")
