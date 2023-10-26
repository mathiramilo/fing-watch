import datetime

import requests
from flask import Blueprint

from ..models.movie import get_movie_info
from ..utils.constants import GORSE_API

feedback = Blueprint("feedback", __name__)

FEEDBACK_TYPES = ["watchlist", "like", "dislike"]


@feedback.post("/<user_id>/<tmdb_id>/<feedback_type>")
def post_feedback(user_id, tmdb_id, feedback_type):
    if not feedback_type in FEEDBACK_TYPES:
        return {"message": "Invalid feedback type."}, 400

    json = [
        {
            "FeedbackType": feedback_type,
            "ItemId": tmdb_id,
            "UserId": user_id,
            "Timestamp": str(datetime.datetime.now()),
        }
    ]

    resp = requests.post(f"{GORSE_API}/feedback", json=json)

    return resp.content, resp.status_code


@feedback.delete("/<feedback_type>/<user_id>/<tmdb_id>")
def delete_feedback(feedback_type, user_id, tmdb_id):
    resp = requests.delete(f"{GORSE_API}/feedback/{feedback_type}/{user_id}/{tmdb_id}")

    return resp.content, resp.status_code


@feedback.get("/<user_id>/<tmdb_id>")
def get_feedbacks_by_movie(user_id, tmdb_id):
    resp = requests.get(f"{GORSE_API}/feedback/{user_id}/{tmdb_id}")

    if not resp.ok:
        return resp.content, resp.status_code

    feedbacks = resp.json()
    content = [feedback["FeedbackType"] for feedback in feedbacks]

    return content, resp.status_code


@feedback.get("/<user_id>")
def get_feedbacks(user_id):
    resp = requests.get(f"{GORSE_API}/user/{user_id}/feedback")

    if not resp.ok:
        return resp.content, resp.status_code

    feedbacks = resp.json()
    content = {feedback: [] for feedback in FEEDBACK_TYPES}

    for feedback in feedbacks:
        movie = get_movie_info(feedback["ItemId"])
        content[feedback["FeedbackType"]].append(movie)

    return content, resp.status_code
