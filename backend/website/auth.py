import json

from app import create_app
from flask import Blueprint, request
from flask_login import current_user, login_required, login_user, logout_user
from website import errors
from werkzeug.security import check_password_hash, generate_password_hash
import werkzeug
import pandas as pd
import os

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
            # return redirect(url_for('views.home'))
        else:
            print("Password incorrect!")
            return errors.incorrect_password(werkzeug.exceptions.BadRequest)
    else:
        print("Email does not exist")
        return errors.email_doesnt_exist(werkzeug.exceptions.BadRequest)
    # TODO what to return here
    return {"email" : email,"password" : password}

@auth.route("/userentry", methods=["POST"], strict_slashes=False)
def register():
   
    email = request.json["email"]
    password = request.json["lastName"]
    vjudge = request.json["vjudgeHandle"]
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

@auth.route("/userentryfile", methods=["POST"], strict_slashes=False)
def registerfile():
   
    file = request.files["excel-file"]
    
    # email = input("email: ")
    # password = input("password: ")
    # vjudge = input("vjudge: ")
    # TODO are the password checks done in the frontend or the backend
    print(file)
    # save_path = 'C:\Users\moham\Desktop'
    # pd.read_csv(file.read())
    path = os.getcwd()
    print(path)
    file.save(os.path.join(path,"file.xlsx"))

    result = pd.read_excel(os.path.join(path,'file.xlsx'))
    df = pd.DataFrame(result)
    for i in df.iterrows():
        vjudge = i[1][0]
        email  = i[1][1]
        password = i[1][2]
        print(email,password,vjudge)
        user = User.getUser(email)
        if user:
            print(user.email)
            print("user already registered")
        else:
            User.addUser(email, vjudge, password=generate_password_hash(
                    password, method='sha256'))
            print("User added successfully")
        
    # f = file.read()
    # print(f)
    # workbook = pd.DataFrame(f)
    # workbook.head()

    
    # TODO what to return here?
    return " " #{"email" : email,"password" : password} 
# register()
