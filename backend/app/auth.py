import hmac
import json
import os
import secrets

import pandas as pd
from flask import Blueprint, request
from werkzeug.security import check_password_hash, generate_password_hash

import app.errors as errors
from .APIs.email_api import send_password_emails, send_password_reset_link
from .models import (
    User,
    Permissions,
    AvailableDays,
    Enrollment,
    Levels,
    Vars,
    Seasons,
)
from .urls import urls

auth = Blueprint("auth", __name__)

PASSWORD_LENGTH = 10
DOMAIN = os.getenv("DOMAIN_NAME")


def check_password_hash_sha256(pwhash: str, password: str) -> bool:
    try:
        method, salt, hashval = pwhash.split("$", 2)
    except ValueError:
        return False

    salt_bytes = salt.encode()
    password_bytes = password.encode()
    hash = hmac.new(salt_bytes, password_bytes, method).hexdigest()
    return hmac.compare_digest(hash, hashval)


@auth.route(urls["LOGIN"], methods=["POST"], strict_slashes=False)
def login():
    email = request.json["email"]
    password = request.json["password"]

    if not User.email_exists(email):
        return errors.email_doesnt_exist()

    user = User(email=email)

    method, _, _ = user.password.split("$", 2)
    login_success = False

    if method == "sha256":
        if check_password_hash_sha256(user.password, password):
            login_success = True
            print("updating hashing method")
            User.update_password(user.id, password)
    else:
        if check_password_hash(user.password, password):
            login_success = True

    if login_success:
        print("Logged in!")
        perm = Permissions(user).get_allowed_permissions()
        # enrollment = Enrollment.getEnrollment(user_id=user.id)
        latest_enrollment_season = Enrollment.get_latest_enrollment_season(
            user_id=user.id
        )
        # user_json = json.dumps(user.__dict__)
        seasons = Seasons.get_all_seasons()
        levels = Levels.get_all_levels()
        registration_status = Vars.get_variable_value(variable_name="registration")
        enrolled_seasons = Seasons.get_enrolled_seasons(user_id=user.id)
    else:
        print("Password incorrect!")
        return errors.incorrect_password()
    return {
        "userInfo": {
            "email": email,
            "password": password,
            "permissions": perm,
            "id": user.id,
            "latestEnrollmentSeason": latest_enrollment_season,
            "enrolledSeasons": enrolled_seasons,
        },
        "seasons": seasons,
        "levels": levels,
        "registrationAvailable": registration_status,
    }


@auth.route(urls["USER_ENTRY"], methods=["POST"], strict_slashes=False)
def register_admin():
    name = request.json["name"]
    email = request.json["email"]
    password = secrets.token_urlsafe(PASSWORD_LENGTH)
    vjudge = request.json["vjudgeHandle"]
    discord = request.json["discordHandle"]
    role_id = request.json["platformRole"]
    level_id = request.json["levelID"]

    if User.email_exists(email):
        print("email already registered")
        return errors.email_already_registered()
    if User.vjudge_handle_exists(vjudge_handle=vjudge):
        print("vjudge handle already registered")
        return errors.vjudge_already_registered()
    User.register_user_by_admin(
        vjudge_handle=vjudge,
        name=name,
        email=email,
        level_id=level_id,
        role_id=role_id,
        discord=discord,
        password=generate_password_hash(password, method="scrypt"),
    )
    print("User added successfully")
    send_password_emails([{"name": name, "password": password, "email": email}])
    return {"email": email, "password": password}


@auth.route(urls["SIGNUP"], methods=["POST"], strict_slashes=False)
def sign_up():
    name = request.json["fullName"]
    email = request.json["email"]
    vjudge = request.json["vjudgeHandle"]
    phone = request.json["phoneNumber"]
    university = request.json["university"]
    faculty = request.json["faculty"]
    level = request.json["level"]
    major = request.json["major"]
    discord_handle = request.json["discordHandle"]
    available_days = request.json["availDays"]
    password = request.json["password"]

    if User.email_exists(email):
        print("email already registered")
        return errors.email_already_registered()
    if User.vjudge_handle_exists(vjudge_handle=vjudge):
        print("Vjudge handle already registered")
        return errors.vjudge_already_registered()
    User.register_user(
        name=name,
        email=email,
        vjudge=vjudge,
        phone=phone,
        university=university,
        faculty=faculty,
        university_level=level,
        major=major,
        discord=discord_handle,
        password=generate_password_hash(password, method="scrypt"),
    )
    print("User added successfully")
    AvailableDays.add_available_days(email=email, available_days=available_days)
    print("Available days added successfully")
    # Enrollment.enrollFromRegistration(email=email)
    # sendPasswordEmails([{"name":name,"password":password,"email":email}])
    return "Signup successful", 200


@auth.route(urls["USER_ENTRY"], methods=["GET"], strict_slashes=False)
def get_roles():
    roles = Permissions.get_all_roles()
    return json.dumps(roles)


@auth.route(urls["USER_ENTRY_FILE"], methods=["POST"], strict_slashes=False)
def register_from_file():
    roles = Permissions.get_all_roles()
    levels = Levels.get_all_levels()
    file = request.files.get("excel-file")
    df = pd.DataFrame(pd.read_excel(file, dtype=str, na_filter=False))
    emails = []
    already_registered = []
    for index, row in df.iterrows():
        index += 2
        name = row["name"]
        email = row["email"]
        vjudge = row["vjudge_handle"]
        phone = row["phone_number"]
        university = row["university"]
        faculty = row["faculty"]
        university_level = row["university_level"]
        major = row["major"]
        discord = row["discord_handle"]
        password = secrets.token_urlsafe(PASSWORD_LENGTH)
        role_name = row["Role"]
        level_name = row["Level"]
        res = [role for role in roles if role["user_role"] == role_name]
        role_id = res[0]["role_id"]
        res2 = [level for level in levels if level["name"] == level_name]
        level_id = res2[0]["level_id"]

        # print(name,email,password)

        def add_already_registered(email):
            already_registered.append(email)
            print(email)
            print("user already registered")

        if User.email_exists(email):
            email_for_vjudge_handle = User.get_user_email_by_vjudge_handle(
                vjudge
            )  # the email associated with the given vjudge handle
            if (email_for_vjudge_handle is not None) and (
                email_for_vjudge_handle != email
            ):
                add_already_registered(email)
                continue

            User.update_data_by_admin_from_file(
                name=name,
                email=email,
                vjudge_handle=vjudge,
                phone=phone,
                university=university,
                faculty=faculty,
                university_level=university_level,
                major=major,
                discord=discord,
            )

        else:
            if User.vjudge_handle_exists(vjudge):
                add_already_registered(email)
                continue

            User.register_user_by_admin(
                name=name,
                email=email,
                vjudge_handle=vjudge,
                phone=phone,
                university=university,
                faculty=faculty,
                university_level=university_level,
                major=major,
                discord=discord,
                password=generate_password_hash(password, method="scrypt"),
                role_id=role_id,
                level_id=level_id,
            )
            print(email, " added successfully")
            emails.append({"email": email, "name": name, "password": password})
    send_password_emails(emails)

    if len(already_registered) > 0:
        return errors.user_already_registered_bulk(already_registered)
    return " "


@auth.route(urls["ASSIGN_MENTORS"], methods=["POST"], strict_slashes=False)
def assign_mentors():
    file = request.files.get("excel-file")
    df = pd.DataFrame(pd.read_excel(file))
    nonexistent_emails = []
    for index, row in df.iterrows():
        index += 2
        trainee_email = row["Email"]
        mentor_email = row["Mentor Email"]
        # print(name,email,password)
        if not User.email_exists(email=trainee_email):
            nonexistent_emails.append(trainee_email)
        elif not User.email_exists(email=mentor_email):
            nonexistent_emails.append(mentor_email)
        elif User.get_user_role_name(email=mentor_email) != "Mentor":
            nonexistent_emails.append(mentor_email)
        elif not Enrollment.is_enrolled(User.get_user_id(email=trainee_email)):
            nonexistent_emails.append(trainee_email)
        elif not Enrollment.is_enrolled(User.get_user_id(email=mentor_email)):
            nonexistent_emails.append(mentor_email)
        else:
            User.assign_mentor(trainee_email=trainee_email, mentor_email=mentor_email)

    if len(nonexistent_emails) > 0:
        return errors.emails_do_not_exist(nonexistent_emails)
    return " "


@auth.route(urls["ENROLL"], methods=["POST"], strict_slashes=False)
def enroll():
    user_id = request.json["user_id"]
    email = request.json["email"]
    registration_status = Vars.get_variable_value(variable_name="registration")
    if not int(registration_status["value"]):
        return errors.registration_closed()
    if Enrollment.get_enrollment(user_id=user_id):
        return errors.user_already_enrolled()
    print(f"Enrolling {email} in new season")
    Enrollment.enroll_from_registration(email=email)
    registered_seasons = Seasons.get_enrolled_seasons(user_id=user_id)
    return {"enrolledSeasons": registered_seasons}


@auth.route(urls["USER_REGISTER_FILE"], methods=["POST"], strict_slashes=False)
def register_users():
    roles = Permissions.get_all_roles()
    levels = Levels.get_all_levels()
    file = request.files.get("excel-file")
    df = pd.DataFrame(pd.read_excel(file))
    nonexistent_emails = []
    for index, row in df.iterrows():
        index += 2
        email = row["Email"]
        role_name = row["Role"]
        res = [role for role in roles if role["user_role"] == role_name]
        role_id = res[0]["role_id"]
        level_name = row["Level"]
        res2 = [level for level in levels if level["name"] == level_name]
        level_id = res2[0]["level_id"]
        # print(name,email,password)
        if not User.email_exists(email=email):
            nonexistent_emails.append(email)
            continue
        user = User(email)
        enrollment = Enrollment.get_enrollment(user_id=user.id)
        print(enrollment)
        print(level_name)
        print(level_id)
        if enrollment is not None:
            Enrollment.update_enrollment_from_file(
                enrollment["enrollment_id"],
                level_id=level_id,
                mentor_id=None,
                enrolled=True,
                role_id=role_id,
            )
        else:
            Enrollment.enroll(user_id=user.id, level_id=level_id, role_id=role_id)

    if len(nonexistent_emails) > 0:
        return errors.emails_do_not_exist_register_file(nonexistent_emails)
    return " "


@auth.route(urls["FORGOT_PASSWORD"], methods=["POST"], strict_slashes=False)
def forgot_password():
    email = request.json["email"]
    if not User.email_exists(email):
        print("Password reset request issued for non-existent email " + email)
        return "", 200

    user = User(email)
    token = User.generate_password_reset_token(user.id)
    link = f"https://{DOMAIN}/reset_password?token={token}"
    send_password_reset_link(email, link)
    return "", 200


@auth.route(urls["RESET_PASSWORD"], methods=["GET"], strict_slashes=False)
def check_password_reset_link():
    token = request.args.get("token")
    if User.check_password_reset_token(token):
        return "Valid Token", 200
    return "Invalid or Expired Token", 404


@auth.route(urls["RESET_PASSWORD"], methods=["POST"], strict_slashes=False)
def reset_password():
    token = request.json["token"]
    password = request.json["password"]
    if User.reset_password_with_token(token, password):
        return "Password updated Successfully", 200
    return "Invalid or Expired Token", 404
