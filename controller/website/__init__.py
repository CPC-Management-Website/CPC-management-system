from cmath import log
from flask import Flask
from flask_cors import CORS
from os import path
from flask_login import LoginManager
import mysql.connector.pooling
import os
from dotenv import load_dotenv
import json
from flask import g

load_dotenv()
cors = CORS()

def create_connection_pool():
    db_config = {
        "host":os.getenv('DB_HOST'),
        "user":os.getenv('DB_USER'),
        'password':os.getenv('DB_PASSWD'),
        'database':os.getenv('DB_DATABASE')
    }
    connection_pool = mysql.connector.pooling.MySQLConnectionPool(
        pool_name = "mypool",
        pool_size = 5,
        autocommit = True,
        **db_config
    )
    return connection_pool

url_file = open('../view/src/server_urls.json')
urls = json.load(url_file)
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


    from model.models import User

    @login_manager.user_loader
    def load_user(email):
        return User.getUser(email)

    pool = create_connection_pool()
    @app.before_request
    def before_request():
        g.db = pool.get_connection()

    @app.teardown_request
    def teardown_request(exception):
        g.db.close()
        
    return app

