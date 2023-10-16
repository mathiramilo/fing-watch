import requests
from flask import Blueprint

from ..utils.constants import GORSE_API

categories = Blueprint("categories", __name__)


@categories.get("/")
def get_categories():
    response = requests.get(GORSE_API + "/dashboard/categories")
    if not response.ok:
        return {"message": "Error"}, 404  # TODO: ???

    data = response.json()

    return data, 200
