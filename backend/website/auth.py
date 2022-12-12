import json

from app import create_app
from flask import Blueprint, request
from flask_login import current_user, login_required, login_user, logout_user
from website import errors
from werkzeug.security import check_password_hash, generate_password_hash
import werkzeug

from .models import User, permissions

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
            perm = permissions(user)
            user_json = json.dumps(user.__dict__)
            permissions_json = json.dumps(perm.__dict__)
            print(user_json)
            print(permissions_json)
            return {"email" : email,"password" : password, "permissions" : permissions_json}
            # return redirect(url_for('views.home'))
        else:
            print("Password incorrect!")
            return errors.incorrect_password(werkzeug.exceptions.BadRequest)
    else:
        print("Email does not exist")
        return errors.email_doesnt_exist(werkzeug.exceptions.BadRequest)

@auth.route("/register", methods=["POST"], strict_slashes=False)
def register():
   
    email = request.json["email"]
    password = request.json["password"]
    vjudge = request.json["vjudge"]
    # email = input("email: ")
    # password = input("password: ")
    # vjudge = input("vjudge: ")
    # TODO are the password checks done in the frontend or the backend
    user = User.getUser(email)

    if user:
        print("user already registered")
    else:
        User.addUser(email, vjudge, password=generate_password_hash(
                password, method='sha256'))
        print("User added successfully")
    # TODO what to return here?
    return {"email" : email,"password" : password}
# register()
