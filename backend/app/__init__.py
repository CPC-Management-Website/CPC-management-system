import os

from flask import Blueprint, Flask


def create_app():
    app = Flask(__name__)

    from flask_cors import CORS

    cors = CORS(app, resources={r"*": {"origins": "*"}})

    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")

    from app.routes.admin import admin
    from app.routes import normal_route

    api = Blueprint("api", __name__, url_prefix="/api")
    api.register_blueprint(admin)
    api.register_blueprint(normal_route)

    app.register_blueprint(api)

    from . import db

    db.init_app(app)

    from . import cli_commands

    cli_commands.init_cli(app)

    return app
