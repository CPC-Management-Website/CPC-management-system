import os
from datetime import datetime

from flask import Flask, g
from flask_cors import CORS

app = Flask(__name__)

cors = CORS(app, resources={r"*": {"origins": "*"}})

app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")

from .models import ProgressPerContest
from .views import views
from .auth import auth
from .errors import errors

app.register_blueprint(views, url_prefix="/")
app.register_blueprint(auth, url_prefix="/")
app.register_blueprint(errors, url_prefix="/")

from . import db

db.init_app(app)


@app.cli.command()
def update_progress():
    """Update contests progress"""
    with app.test_request_context():
        app.preprocess_request()
        print(datetime.utcnow(), "Updating Contests Progress...")
        ProgressPerContest.update_all_progress()
        print(datetime.utcnow(), "Done!")
        print()
