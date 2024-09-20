import json
from flask import Blueprint, request

from app import errors
from app.APIs.email_api import send_password_reset_link
from app.models import Enrollment, ProgressPerContest, Resources, User


user = Blueprint("user", __name__, url_prefix="/users")


@user.route("/<int:user_id>", methods=["GET"], strict_slashes=False)
def get_user(user_id):
    email = User.get_user_email(user_id)
    # if(User.exists(email)==False):
    #     return errors.email_doesnt_exist(werkzeug.exceptions.BadRequest)
    print(email)
    user = User(email=email)

    return json.dumps(user.__dict__)


@user.route("/<int:user_id>", methods=["PUT"], strict_slashes=False)
def update_user(user_id):
    email = request.json["email"]
    name = request.json["name"]
    vjudge_handle = request.json["vjudgeHandle"]
    # password = request.json["password"]

    error = User.check_availability(
        user_id=user_id, email=email, vjudge_handle=vjudge_handle
    )
    if error:
        return error
    User.update_data(user_id, email, name, vjudge_handle)

    return "Success"


@user.route("/<int:user_id>/password", methods=["PUT"], strict_slashes=False)
def update_password(user_id):
    old_password = request.json["oldPassword"]
    new_password = request.json["newPassword"]
    if not User.check_password(user_id, old_password):
        return "Wrong password", 401
    User.update_password(user_id, new_password)
    return "Success"


@user.route("/<int:user_id>/progress", methods=["GET"], strict_slashes=False)
def get_progress(user_id: int):
    season = request.args.get("season")
    return ProgressPerContest.get_user_progress(user_id=user_id, season_id=season)


@user.route("/<int:user_id>/resources", methods=["GET"], strict_slashes=False)
def get_my_resources(user_id):
    season = request.args.get("season")
    resources = Resources.get_resources(user_id=user_id, season_id=season)
    return json.dumps(resources)


@user.route("/<int:user_id>/mentor", methods=["GET"], strict_slashes=False)
def get_mentor(user_id):
    season = request.args.get("season_id")
    mentor = User.get_mentor_info(user_id=user_id, season_id=season)
    if mentor is not None:
        return mentor
    return ""


@user.route("/<int:user_id>/registration-level", methods=["GET"], strict_slashes=False)
def get_registration_level(user_id):
    level = Enrollment.get_enrollment_level(user_id=user_id)
    return json.dumps(level)
