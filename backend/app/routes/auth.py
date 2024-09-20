import hmac
import os
from flask import Blueprint, request
from werkzeug.security import check_password_hash, generate_password_hash

from app import errors
from app.APIs.email_api import send_password_reset_link
from app.models import (
    AvailableDays,
    Enrollment,
    Levels,
    Permissions,
    Seasons,
    User,
    Vars,
)


auth = Blueprint("auth", __name__, url_prefix="/auth")

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


@auth.route("/login", methods=["POST"], strict_slashes=False)
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


@auth.route("/signup", methods=["POST"], strict_slashes=False)
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


@auth.route("/forgot-password", methods=["POST"], strict_slashes=False)
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


@auth.route("/reset-password", methods=["GET"], strict_slashes=False)
def check_password_reset_link():
    token = request.args.get("token")
    if User.check_password_reset_token(token):
        return "Valid Token", 200
    return "Invalid or Expired Token", 404


@auth.route("/reset-password", methods=["POST"], strict_slashes=False)
def reset_password():
    token = request.json["token"]
    password = request.json["password"]
    if User.reset_password_with_token(token, password):
        return "Password updated Successfully", 200
    return "Invalid or Expired Token", 404
