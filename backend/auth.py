import json

from flask import Blueprint, request
from flask_login import current_user, login_required, login_user, logout_user
import errors
from werkzeug.security import check_password_hash, generate_password_hash
import werkzeug
import pandas as pd
import os
import secrets
from urls import urls
from models import User, Permissions, AvailableDays
from APIs.email_api import sendPasswordEmails

auth = Blueprint("auth", __name__)

remember_logins = False     # consider changing this to true
password_length = 10



@auth.route(urls['LOGIN'], methods=["POST"], strict_slashes=False)
def login():
    email = request.json["email"]
    password = request.json["password"]
    
    if(User.email_exists(email)==False):
        return errors.email_doesnt_exist(werkzeug.exceptions.BadRequest)

    user = User(email = email)

    if check_password_hash(user.password, password):
        print("Logged in!")
        login_user(user,remember = remember_logins)
        perm = Permissions(user).getAllowedPermissions()
        user_json = json.dumps(user.__dict__)

    else:
        print("Password incorrect!")
        return errors.incorrect_password(werkzeug.exceptions.BadRequest)
    return {"email" : email,"password" : password, "permissions": perm}

@auth.route(urls['USER_ENTRY'], methods=["POST"], strict_slashes=False)
def register_admin():
    name = request.json["firstName"]+" "+request.json["lastName"]
    email = request.json["email"]
    password = secrets.token_urlsafe(password_length)
    vjudge = request.json["vjudgeHandle"]
    roleID = request.json["platformRole"]
    level = request.json["level"]

    if User.email_exists(email):
        print("email already registered")
        return errors.email_already_registered(werkzeug.exceptions.BadRequest)
    if User.vjudge_handle_exists(vjudge_handle=vjudge):
        print("vjudge handle already registered")
        return errors.vjudge_already_registered(werkzeug.exceptions.BadRequest)
    User.addUser(vjudge_handle = vjudge,name = name,
                email = email, level = level,roleID = roleID,
                enrolled = True, points = 0,
                password = generate_password_hash(password, method='sha256'))
    print("User added successfully")
    sendPasswordEmails([{"name":name,"password":password,"email":email}])
    return {"email" : email,"password" : password}

@auth.route(urls['REGISTER'], methods=["POST"], strict_slashes=False)
def register():
    name = request.json["fullName"]
    email = request.json["email"]
    vjudge = request.json["vjudgeHandle"]
    phone = request.json["phoneNumber"]
    university = request.json["university"]
    faculty = request.json["faculty"]
    level = request.json["level"]
    major = request.json["major"]
    availableDays = request.json["availDays"]
    password = secrets.token_urlsafe(password_length)

    if User.email_exists(email):
        print("email already registered")
        return errors.email_already_registered(werkzeug.exceptions.BadRequest)
    if User.vjudge_handle_exists(vjudge_handle=vjudge):
        print("Vjudge handle already registered")
        return errors.vjudge_already_registered(werkzeug.exceptions.BadRequest)
    User.registerUser(
        name=name,
        email=email,
        vjudge=vjudge,
        phone=phone,
        university=university,
        faculty=faculty,
        university_level=level,
        major=major,
        password=generate_password_hash(password, method='sha256')
    )
    print("User added successfully")
    AvailableDays.addAvailableDays(email=email,availableDays=availableDays)
    print("Available days added successfully")
    sendPasswordEmails([{"name":name,"password":password,"email":email}])
    return {"email" : email,"password" : password}

@auth.route(urls['USER_ENTRY'], methods=["GET"], strict_slashes=False)
def getRoles():
    roles = Permissions.getAllRoles()
    return json.dumps(roles)

@auth.route(urls['USER_ENTRY_FILE'], methods=["POST"], strict_slashes=False)
def registerfile():
    roles = Permissions.getAllRoles()
    file = request.files.get("excel-file")
    df = pd.DataFrame(pd.read_excel(file))
    emails = []
    already_registered = []
    for index, row in df.iterrows():
        index+=2
        vjudge = row["vjudge"]
        email  = row["email"]
        password = secrets.token_urlsafe(password_length)
        name = row["name"]
        roleName = row["role"]
        res = [role for role in roles if role['user_role'] == roleName]
        roleID = res[0]["role_id"]
        level = row["level"]
        # print(name,email,password)
        if User.email_exists(email):
            print(email)
            print("user already registered")
            already_registered.append(email)
        else:
            User.addUser(vjudge_handle = vjudge,name = name,
                    email = email, level = level,roleID = roleID,
                    enrolled = True, points = 0,
                    password = generate_password_hash(password, method='sha256'))
            print(email, " added successfully")
            emails.append({"email":email,"name":name,"password":password})
    sendPasswordEmails(emails)    

    if len(already_registered)>0:
        return errors.email_already_registered_bulk(already_registered,werkzeug.exceptions.BadRequest)
    return " "
