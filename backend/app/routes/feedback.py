from flask import Blueprint
from flask import request
import requests
from ..utils.constants import GORSE_API

feedback = Blueprint("feedback", __name__)


@feedback.put("/")
def put_feedback():
    resp = requests.post(GORSE_API + "/feedback", json=request.get_data())

    return resp.content, resp.status_code


@feedback.get("/<user_id>/<tmdb_id>")
def get_feedback(user_id, tmdb_id):
    resp = requests.get(GORSE_API + f"/feedback/{user_id}/{tmdb_id}")

    return resp.content, resp.status_code
