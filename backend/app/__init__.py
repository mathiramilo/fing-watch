from flask import Flask
from flask_cors import CORS

from .routes.auth import auth
from .routes.categories import categories
from .routes.feedback import feedback
from .routes.movies import movies
from .routes.recommend import recommend
from .routes.users import users


def create_app():
    app = Flask(__name__)

    cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

    app.register_blueprint(auth, url_prefix="/api/auth")
    app.register_blueprint(movies, url_prefix="/api/movies")
    app.register_blueprint(users, url_prefix="/api/users")
    app.register_blueprint(recommend, url_prefix="/api/recommend")
    app.register_blueprint(feedback, url_prefix="/api/feedback")
    app.register_blueprint(categories, url_prefix="/api/categories")

    return app
