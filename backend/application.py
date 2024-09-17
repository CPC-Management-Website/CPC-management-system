import os
from datetime import datetime

import mysql.connector.pooling
from dotenv import load_dotenv
from flask import Flask, g
from flask_cors import CORS
from flask_login import LoginManager

from models import ProgressPerContest

load_dotenv()
cors = CORS()


def create_connection_pool():
    db_config = {
        "host": os.getenv("DB_HOST"),
        "user": os.getenv("DB_USER"),
        "password": os.getenv("DB_PASSWD"),
        "database": os.getenv("DB_DATABASE"),
    }
    connection_pool = mysql.connector.pooling.MySQLConnectionPool(
        pool_name="my_pool", pool_size=6, autocommit=True, **db_config
    )
    return connection_pool


def create_app():
    app = Flask(__name__)
    cors.init_app(app, resources={r"*": {"origins": "*"}})
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")

    from views import views
    from auth import auth
    from errors import errors

    app.register_blueprint(views, url_prefix="/")
    app.register_blueprint(auth, url_prefix="/")
    app.register_blueprint(errors, url_prefix="/")

    login_manager = LoginManager()
    login_manager.init_app(app)

    from models import User

    @login_manager.user_loader
    def load_user(email):
        # return User.getUser(email)
        return User(email)

    pool = create_connection_pool()

    @app.before_request
    def before_request():
        g.db = pool.get_connection()

    @app.teardown_request
    def teardown_request(exception):
        g.db.close()

    return app


app = create_app()


@app.cli.command()
def update_progress():
    """Update contests progress"""
    with app.test_request_context():
        app.preprocess_request()
        print(datetime.utcnow(), "Updating Contests Progress...")
        ProgressPerContest.update_all_progress()
        print(datetime.utcnow(), "Done!")
        print()


if __name__ == "__main__":
    app.run()
