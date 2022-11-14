from flask import request, Blueprint
from app import create_app
from .models import User, permissions
from flask_login import current_user, login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash
import json

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
            # return redirect(url_for('views.home'))
        else:
            print("Password incorrect!")
            return {"Error" : "Wrong Password"}, 401
    else:
        print("Email does not exist")
        return {"Error" : "Email does not exist"}, 402
    # TODO what to return here
    return {"email" : email,"password" : password}

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
