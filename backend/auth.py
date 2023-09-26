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
from models import User, Permissions, AvailableDays, Enrollment, Levels
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
        #enrollment = Enrollment.getEnrollment(user_id=user.id)
        user_json = json.dumps(user.__dict__)
    else:
        print("Password incorrect!")
        return errors.incorrect_password(werkzeug.exceptions.BadRequest)
    return {"email" : email,"password" : password, "permissions": perm, "id" : user.id}

@auth.route(urls['USER_ENTRY'], methods=["POST"], strict_slashes=False)
def register_admin():
    name = request.json["firstName"]+" "+request.json["lastName"]
    email = request.json["email"]
    password = secrets.token_urlsafe(password_length)
    vjudge = request.json["vjudgeHandle"]
    discord = request.json["discordHandle"]
    roleID = request.json["platformRole"]
    levelID = request.json["levelID"]

    if User.email_exists(email):
        print("email already registered")
        return errors.email_already_registered(werkzeug.exceptions.BadRequest)
    if User.vjudge_handle_exists(vjudge_handle=vjudge):
        print("vjudge handle already registered")
        return errors.vjudge_already_registered(werkzeug.exceptions.BadRequest)
    User.registerUser_admin(vjudge_handle = vjudge,name = name,
                email = email, level_id = levelID,roleID = roleID,
                points = 0,discord=discord,
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
    discordHandle = request.json["discordHandle"]
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
        discord=discordHandle,
        password=generate_password_hash(password, method='sha256')
    )
    print("User added successfully")
    AvailableDays.addAvailableDays(email=email,availableDays=availableDays)
    print("Available days added successfully")
    Enrollment.enrollFromRegistration(email=email)
    sendPasswordEmails([{"name":name,"password":password,"email":email}])
    return {"email" : email,"password" : password}

@auth.route(urls['USER_ENTRY'], methods=["GET"], strict_slashes=False)
def getRoles():
    roles = Permissions.getAllRoles()
    return json.dumps(roles)

@auth.route(urls['USER_ENTRY_FILE'], methods=["POST"], strict_slashes=False)
def registerfile():
    roles = Permissions.getAllRoles()
    levels  = Levels.getAllLevels()
    file = request.files.get("excel-file")
    df = pd.DataFrame(pd.read_excel(file))
    emails = []
    already_registered = []
    for index, row in df.iterrows():
        index+=2
        vjudge = row["Vjudge Handle"]
        email  = row["Email"]
        password = secrets.token_urlsafe(password_length)
        name = row["Name"]
        roleName = row["Role"]
        res = [role for role in roles if role['user_role'] == roleName]
        roleID = res[0]["role_id"]
        levelName = row["Level"]
        res2 = [level for level in levels if level['name'] == levelName]
        levelID = res2[0]["level_id"]
        discord = row["Discord"]
        # print(name,email,password)
        if User.email_exists(email) or User.vjudge_handle_exists(vjudge):
            print(email)
            print("user already registered")
            already_registered.append(email)
        else:
            User.registerUser_admin(vjudge_handle = vjudge,name = name,
                    email = email, level_id = levelID, roleID = roleID,
                    points = 0,
                    discord=discord,
                    password = generate_password_hash(password, method='sha256'))
            print(email, " added successfully")
            emails.append({"email":email,"name":name,"password":password})
    sendPasswordEmails(emails)    

    if len(already_registered)>0:
        return errors.user_already_registered_bulk(already_registered,werkzeug.exceptions.BadRequest)
    return " "

@auth.route(urls['ASSIGN_MENTORS'], methods=["POST"], strict_slashes=False)
def assignMentors():
    file = request.files.get("excel-file")
    df = pd.DataFrame(pd.read_excel(file))
    nonexistant_emails = []
    for index, row in df.iterrows():
        index+=2
        trainee_email  = row["Email"]
        mentor_email = row["Mentor Email"]
        # print(name,email,password)
        if User.email_exists(email=trainee_email)==False:
            nonexistant_emails.append(trainee_email)
        elif User.email_exists(email=mentor_email)==False:
            nonexistant_emails.append(mentor_email)
        elif User.getUserRoleName(email = mentor_email) != "Mentor":
            nonexistant_emails.append(mentor_email)
        elif Enrollment.isEnrolled(User.getUserID(email=trainee_email))==False:
            nonexistant_emails.append(trainee_email)
        elif Enrollment.isEnrolled(User.getUserID(email=mentor_email))==False:
            nonexistant_emails.append(mentor_email)
        else:
            User.assignMentor(traineeEmail=trainee_email,mentorEmail=mentor_email)

        
    if len(nonexistant_emails)>0:
        return errors.emails_do_not_exist(nonexistant_emails,werkzeug.exceptions.BadRequest)
    return " "
