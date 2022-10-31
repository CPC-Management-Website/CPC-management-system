from flask import request, Blueprint
from app import create_app
from .models import User
from flask_login import current_user, login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash

auth = Blueprint("auth", __name__)

remember_logins = False     # consider changing this to true

# Defining functionality for "/data" endpoint
@auth.route('/data', methods=["GET"], strict_slashes=False)
def get_data():
    return {
		"X":"dataaa"
		}


@auth.route("/login", methods=["POST"], strict_slashes=False)
def login():
   
    email = request.json["email"]
    password = request.json["password"]

    user = User.getUser(email)

    if user:
        if check_password_hash(user.password, password):
            print("Logged in!")
            login_user(user,remember = remember_logins)
            # return redirect(url_for('views.home'))
        else:
            print("Password incorrect!")
    else:
        print("Email does not exist")
    return {"email" : email,"password" : password}
