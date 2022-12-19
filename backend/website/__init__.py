from cmath import log
from flask import Flask
from flask_cors import CORS
from os import path
from flask_login import LoginManager
import mysql.connector
import os
from dotenv import load_dotenv
import js2py

load_dotenv()
cors = CORS()

db = mysql.connector.connect(
    host=os.getenv('DB_HOST'),
    user=os.getenv('DB_USER'),
    passwd=os.getenv('DB_PASSWD'),
    database=os.getenv('DB_DATABASE')
)

eval_result, urls = js2py.run_file('../frontend/src/backend_urls.js')
def create_app():
    app = Flask(__name__)
    cors.init_app(app, resources={r"*": {"origins": "*"}})
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')

    from .views import views
    from .auth import auth
    from .errors import errors
    app.register_blueprint(views, url_prefix="/")
    app.register_blueprint(auth, url_prefix="/")
    app.register_blueprint(errors, url_prefix = "/")

    login_manager = LoginManager()
    login_manager.init_app(app)


    from .models import User

    @login_manager.user_loader
    def load_user(email):
        return User.getUser(email)


    return app

