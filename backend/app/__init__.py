from flask import Flask

from .routes.auth import auth
from .routes.movies import movies
from .routes.users import users


def create_app():
    app = Flask(__name__)

    app.register_blueprint(auth, url_prefix="/api/auth")
    app.register_blueprint(movies, url_prefix="/api/movies")
    app.register_blueprint(users, url_prefix="/api/users")

    return app
