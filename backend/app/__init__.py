import os
from datetime import datetime

import mysql.connector.pooling
from flask import Flask, g
from flask_cors import CORS

app = Flask(__name__)

cors = CORS(app, resources={r"*": {"origins": "*"}})

app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")

from app.models import ProgressPerContest
from app.views import views
from app.auth import auth
from app.errors import errors

app.register_blueprint(views, url_prefix="/")
app.register_blueprint(auth, url_prefix="/")
app.register_blueprint(errors, url_prefix="/")


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


pool = create_connection_pool()


@app.before_request
def before_request():
    g.db = pool.get_connection()


@app.teardown_request
def teardown_request(exception):
    g.db.close()


@app.cli.command()
def update_progress():
    """Update contests progress"""
    with app.test_request_context():
        app.preprocess_request()
        print(datetime.utcnow(), "Updating Contests Progress...")
        ProgressPerContest.update_all_progress()
        print(datetime.utcnow(), "Done!")
        print()
