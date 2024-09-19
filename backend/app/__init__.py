import os

from flask import Flask


def create_app():
    app = Flask(__name__)

    from flask_cors import CORS

    cors = CORS(app, resources={r"*": {"origins": "*"}})

    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")

    from .views import views
    from .auth import auth
    from .errors import errors

    app.register_blueprint(views, url_prefix="/")
    app.register_blueprint(auth, url_prefix="/")
    app.register_blueprint(errors, url_prefix="/")

    from . import db

    db.init_app(app)

    from . import cli_commands

    cli_commands.init_cli(app)

    return app
