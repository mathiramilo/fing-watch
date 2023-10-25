import os

import requests


def get_movie_info(tmdb_id, all_fields=False):
    url = os.environ["TYPESENSE"] + f"/collections/movies/documents/{tmdb_id}"
    headers = {"X-TYPESENSE-API-KEY": os.environ["TYPESENSE_KEY"]}

    resp = requests.get(url, headers=headers)

    if not resp.ok:
        raise Exception("Movie not found.")

    excluded_fields = None if all_fields else ["watch_providers", "keywords"]

    json = resp.json()

    if not excluded_fields:
        return json

    return {key: value for (key, value) in json.items() if key not in excluded_fields}


def get_movies(movies_ids):
    return [get_movie_info(tmdb_id) for tmdb_id in movies_ids]
