import json
import secrets
from flask import Blueprint, request
from werkzeug.security import check_password_hash, generate_password_hash
import pandas as pd

from app import errors
from app.APIs.email_api import send_password_emails
from app.models import Enrollment, Levels, Permissions, User


user = Blueprint("user", __name__, url_prefix="/users")

PASSWORD_LENGTH = 10


@user.route("/", methods=["GET"], strict_slashes=False)
def get_users():
    role = request.args.get("role")
    season = request.args.get("season")
    users = User.get_all_users(role=role, season_id=season)

    return json.dumps(users)


@user.route("/<int:user_id>", methods=["DELETE"], strict_slashes=False)
def delete_user(user_id):
    User.delete_user(user_id)
    print("Deleted user", user_id)
    return "Success"


@user.route("/<int:user_id>", methods=["PUT"], strict_slashes=False)
def edit_profile_admin(user_id):
    name = request.json["name"]
    vjudge_handle = request.json["vjudgeHandle"]
    email = request.json["email"]
    mentor_id = request.json["mentorID"]
    enrollment_id = request.json["enrollmentID"]
    level_id = request.json["levelID"]
    season_id = request.json["seasonID"]
    enrolled = request.json["enrolled"]

    error = User.check_availability(
        user_id=user_id, email=email, vjudge_handle=vjudge_handle
    )
    if error:
        return error
    User.update_data_by_admin(user_id, name, vjudge_handle, email)
    if enrollment_id:
        Enrollment.update_enrollment(
            enrollment_id=enrollment_id,
            level_id=level_id,
            season_id=season_id,
            mentor_id=mentor_id,
            enrolled=enrolled,
        )
    else:
        Enrollment.enroll(user_id=user_id, level_id=level_id)

    return {"hereeee": "here"}


@user.route("/", methods=["POST"], strict_slashes=False)
def register_admin():
    if request.content_type == "application/json":
        return register_admin_json()
    else:
        return register_from_file()


def register_admin_json():
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
