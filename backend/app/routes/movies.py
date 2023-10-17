import os

import requests
from flask import Blueprint, request

from ..models import movie
from ..utils.constants import GORSE_API

movies = Blueprint("movies", __name__)


def process_request(endpoint):
    parms = {parm: request.args.get(parm) for parm in request.args}

    resp = requests.get(GORSE_API + endpoint, params=parms)
    if not resp.ok:
        return {"message": "Error"}, 404  # TODO: ???

    # get movies id from gorse
    movies_ids = [item["Id"] for item in resp.json()]

    result = movie.get_movies(movies_ids)

    return result, 200


@movies.get("/popular")
def get_popular():
    return process_request("/popular")


@movies.get("/popular/<genre_id>")
def get_popular_by_genre(genre_id):
    return process_request(f"/popular/{genre_id}")


@movies.get("/latest")
def get_latest():
    return process_request("/latest")


@movies.get("/latest/<genre_id>")
def get_latest_by_genre(genre_id):
    return process_request(f"/latest/{genre_id}")


@movies.get("/neighbors/<tmdb_id>")
def get_neighbors(tmdb_id):
    return process_request(f"/item/{tmdb_id}/neighbors")


@movies.get("/neighbors/<tmdb_id>/<genre_id>")
def get_neighbors_by_genre(tmdb_id, genre_id):
    return process_request(f"/item/{tmdb_id}/neighbors/{genre_id}")


@movies.get("/")
def query():
    url = os.environ["TYPESENSE"] + "/collections/movies/documents/search"
    query = {
        "q": request.args.get("q"),
        "per_page": request.args.get("per_page", 10),
        "query_by": "title",
        "prioritize_token_position": "true",
        "sort_by": "popularity:desc",
        "exclude_fields": "watch_providers",
    }
    headers = {"X-TYPESENSE-API-KEY": os.environ["TYPESENSE_KEY"]}
    resp = requests.get(url, params=query, headers=headers)

    return resp.content, resp.status_code


@movies.get("/<tmdb_id>")
def get_movie(tmdb_id):
    content = movie.get_movie_info(tmdb_id, all_fields=True)
    return content, 200
