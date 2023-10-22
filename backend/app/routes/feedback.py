import requests
from flask import Blueprint, request

from ..utils.constants import GORSE_API

feedback = Blueprint("feedback", __name__)


@feedback.post("/")
def put_feedback():
    resp = requests.post(GORSE_API + "/feedback", json=request.get_json())

    return resp.content, resp.status_code


@feedback.delete("/<feedback_type>/<user_id>/<tmdb_id>")
def delete_feedback(feedback_type, user_id, tmdb_id):
    resp = requests.delete(GORSE_API + f"/feedback/{feedback_type}/{user_id}/{tmdb_id}")

    return resp.content, resp.status_code


@feedback.get("/<user_id>/<tmdb_id>")
def get_feedback(user_id, tmdb_id):
    resp = requests.get(GORSE_API + f"/feedback/{user_id}/{tmdb_id}")

    return resp.content, resp.status_code
