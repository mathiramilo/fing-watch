import requests
import os
from flask import Blueprint


genres = Blueprint("genres", __name__)


@genres.get("/")
def get_genres():
    headers = {"Authorization": f"Bearer {os.environ['TMDB_API_KEY']}"}

    resp = requests.get(
        "https://api.themoviedb.org/3/genre/movie/list", headers=headers
    )

    return resp.json(), resp.status_code
