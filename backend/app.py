from flask import Flask
from flask_cors import CORS


cors = CORS()

def create_app():
    # Initializing flask app
    app = Flask(__name__)

    # initializing CORS to allow access to the API from other domains
    
    cors.init_app(app, resources={r"*": {"origins": "*"}})
    
    return app
