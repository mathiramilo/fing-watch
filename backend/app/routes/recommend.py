from flask import Blueprint
from flask import request

recommend = Blueprint("recommend", __name__)


def get_args():
    return request.args.get("n", default=10)


@recommend.get("/<user_id>/<recommender>")
def get_rec(user_id):
    n = get_args()

    result = {"message": f"Getting {n} recommendations to {user_id}!"}
    return result, 200


@recommend.get("/<user_id>/<recommender>")
def get_rec_by_recommender(user_id, recommender):
    n = get_args()

    result = {"message": f"Getting {n} {recommender} recommendations to {user_id}!"}
    return result, 200


@recommend.get("/<user_id>/<recommender>/<category>")
def get_rec_by_recommender_and_category(user_id, recommender, category):
    n = get_args()

    result = {
        "message": f"Getting {n} {recommender} recommendations of {category} to {user_id}!"
    }
    return result, 200
