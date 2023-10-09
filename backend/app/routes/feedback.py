from flask import Blueprint
from flask import request

feedback = Blueprint("feedback", __name__)


@feedback.put("/")
def put_feedback():
    body = request.get_data()

    result = {"message": "Inserting feedbacks. Existed feedback will be overwritten.!"}
    return result, 200
