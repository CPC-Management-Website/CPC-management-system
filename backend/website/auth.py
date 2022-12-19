import json

from flask import Blueprint, request
from flask_login import current_user, login_required, login_user, logout_user
from website import errors
from werkzeug.security import check_password_hash, generate_password_hash
import werkzeug
import pandas as pd
import os
import secrets
from .__init__ import urls

from .models import User, permissions
from .email_api import sendPasswordEmails
auth = Blueprint("auth", __name__)

remember_logins = False     # consider changing this to true
password_length = 10


#eval_result, urls = js2py.run_file('../urls.js')


# Defining functionality for "/data" endpoint
@auth.route(urls.DATA, methods=["GET"], strict_slashes=False)
def get_data():
    return {
		"X":"dataaa"
		}


@auth.route(urls.LOGIN, methods=["POST"], strict_slashes=False)
def login():

    email = request.json["email"]
    password = request.json["password"]
    
    user = User(email = email)

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

@auth.route(urls.USER_ENTRY, methods=["POST"], strict_slashes=False)
def register():
    name = request.json["firstName"]+" "+request.json["lastName"]
    email = request.json["email"]
    password = secrets.token_urlsafe(password_length)
    vjudge = request.json["vjudgeHandle"]
    role = request.json["platformRole"]

    if User.exists(email):
        print("user already registered")
    else:
        User.addUser(vjudge_handle = vjudge,name = name,
                    email = email, level = 1,role = role,
                    active = True, points = 0,
                    password = generate_password_hash(password, method='sha256'))
        print("User added successfully")
        sendPasswordEmails([{"name":name,"password":password,"email":email}])
    # TODO what to return here?
    return {"email" : email,"password" : password}

@auth.route(urls.USER_ENTRY_FILE, methods=["POST"], strict_slashes=False)
def registerfile():
   
    file = request.files.get("excel-file")
    df = pd.DataFrame(pd.read_excel(file))
    emails = []
    for i, row in df.iterrows():
        vjudge = row["vjudge"]
        email  = row["email"]
        password = secrets.token_urlsafe(password_length)
        name = row["name"]
        role = "Trainee"
        # print(name,email,password)
        if User.exists(email):
            print(email)
            print("user already registered")
        else:
            User.addUser(vjudge_handle = vjudge,name = name,
                    email = email, level = 1,role = role,
                    active = True, points = 0,
                    password = generate_password_hash(password, method='sha256'))
            print("User added successfully")
            emails.append({"email":email,"name":name,"password":password})
    sendPasswordEmails(emails)    
    # f = file.read()
    # print(f)
    # workbook = pd.DataFrame(f)
    # workbook.head()

    
    # TODO what to return here?
    return " " #{"email" : email,"password" : password} 
