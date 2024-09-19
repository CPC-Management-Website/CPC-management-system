import json

from flask import Blueprint
from flask import request

import app.errors as errors
from .models import ProgressPerContest
from .models import User, Resources, Levels, Enrollment, Vars, Seasons
from .urls import urls

# import sys
# # sys.path.append("..")

views = Blueprint("views", __name__)


@views.route("/api/users/<int:user_id>", methods=["GET"], strict_slashes=False)
def display_profile(user_id):
    email = User.get_user_email(user_id)
    # if(User.exists(email)==False):
    #     return errors.email_doesnt_exist(werkzeug.exceptions.BadRequest)
    print(email)
    user = User(email=email)

    return json.dumps(user.__dict__)


def check_availability(user_id, email, vjudge_handle):
    old_email = User.get_user_email(user_id=user_id)
    if old_email != email and User.email_exists(email=email):
        return errors.email_already_registered()

    old_vjudge_handle = User.get_vjudge_handle(user_id=user_id)
    if old_vjudge_handle != vjudge_handle and User.vjudge_handle_exists(
        vjudge_handle=vjudge_handle
    ):
        return errors.vjudge_already_registered()


@views.route("/api/users/<int:user_id>", methods=["PUT"], strict_slashes=False)
def edit_profile(user_id):
    email = request.json["email"]
    name = request.json["name"]
    vjudge_handle = request.json["vjudgeHandle"]
    # password = request.json["password"]

    error = check_availability(
        user_id=user_id, email=email, vjudge_handle=vjudge_handle
    )
    if error:
        return error
    User.update_data(user_id, email, name, vjudge_handle)

    return "Success"


@views.route("/api/users/<int:user_id>/password", methods=["PUT"], strict_slashes=False)
def update_password(user_id):
    old_password = request.json["oldPassword"]
    new_password = request.json["newPassword"]
    if not User.check_password(user_id, old_password):
        return "Wrong password", 401
    User.update_password(user_id, new_password)
    return "Success"


@views.route(urls["PROFILE_ADMIN"], methods=["POST"], strict_slashes=False)
def edit_profile_admin():
    user_id = request.json["userID"]
    name = request.json["name"]
    vjudge_handle = request.json["vjudgeHandle"]
    email = request.json["email"]
    mentor_id = request.json["mentorID"]
    enrollment_id = request.json["enrollmentID"]
    level_id = request.json["levelID"]
    season_id = request.json["seasonID"]
    enrolled = request.json["enrolled"]

    error = check_availability(
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


@views.route(urls["USERS"], methods=["GET"], strict_slashes=False)
def get_users():
    role = request.args.get("role")
    season = request.args.get("season")
    users = User.get_all_users(role=role, season_id=season)

    return json.dumps(users)


@views.route(
    "/api/users/<int:mentor_id>/mentees", methods=["GET"], strict_slashes=False
)
def get_mentees(mentor_id):
    season = request.args.get("season")
    print(mentor_id)
    users = User.get_mentees(mentor_id=mentor_id, season_id=season)

    return json.dumps(users)


@views.route(urls["USERS"], methods=["PATCH"], strict_slashes=False)
def rest_user_password():
    user_id = request.json["user_id"]
    User.reset_password(user_id)
    print("Reset password for ", user_id)
    return "Success"


@views.route(urls["USERS"], methods=["DELETE"], strict_slashes=False)
def delete_user():
    email = request.args.get("email")
    User.delete_user(email)
    print("Deleted user", email)
    return "Success"


@views.route("/api/users/<int:user_id>/progress", methods=["GET"], strict_slashes=False)
def get_progress(user_id: int):
    season = request.args.get("season")
    return ProgressPerContest.get_user_progress(user_id=user_id, season_id=season)


@views.route("/api/contests/<int:contest_id>", methods=["POST"], strict_slashes=False)
def add_contest(contest_id):
    num_of_problems = request.json["numOfProblems"]
    yellow_threshold = request.json["yellowThreshold"]
    green_threshold = request.json["greenThreshold"]
    topic = request.json["topic"]
    week_num = request.json["weekNum"]
    level_id = request.json["levelID"]
    status = ProgressPerContest.add_contest(
        contest_id,
        num_of_problems,
        yellow_threshold,
        green_threshold,
        topic,
        week_num,
        level_id,
    )
    print(status)
    if status == "Contest already registered":
        return errors.contest_already_registered()
    elif status == "Incorrect date format":
        return errors.invalid_date_format()
    ProgressPerContest.init_contest_progress_contest(contest_id=contest_id)
    # ProgressPerContest.updateProgress(contest_id=contestID)
    # ProgressPerContest.addProgress(contestID)
    return {"add contest": "in add contest"}


@views.route("/api/contests", methods=["GET"], strict_slashes=False)
def get_contests():
    season = request.args.get("season")
    return ProgressPerContest.get_contests_admin(season=season)


# TODO consider changing how this route deals with changing contest id
@views.route(
    "/api/contests/<int:old_contest_id>", methods=["PATCH"], strict_slashes=False
)
def update_contest(old_contest_id):
    new_contest_id = request.json["contest_id"]
    topic = request.json["topic"]
    yellow_threshold = request.json["yellow_threshold"]
    green_threshold = request.json["green_threshold"]
    total_problems = request.json["total_problems"]
    week_number = request.json["week_number"]
    level_id = request.json["level_id"]
    try:
        ProgressPerContest.update_contest(
            new_contest_id,
            topic,
            yellow_threshold,
            green_threshold,
            total_problems,
            week_number,
            level_id,
            old_contest_id,
        )
    except Exception as e:
        print(e)
        return errors.contest_already_registered()
    return "Success"


@views.route("/api/contests/<int:contest_id>", methods=["DELETE"], strict_slashes=False)
def delete_contest(contest_id):
    ProgressPerContest.delete_contest(contest_id=contest_id)
    return "Success"


@views.route("/api/resources", methods=["POST"], strict_slashes=False)
def add_resource():
    resource_topic = request.json["resourceTopic"]
    resource_link = request.json["resourceLink"]
    resource_level = request.json["resourceLevel"]
    resource_season = request.json["seasonID"]
    Resources.add_resource(
        topic=resource_topic,
        link=resource_link,
        level=resource_level,
        season_id=resource_season,
    )
    return ""


@views.route("/api/resources", methods=["GET"], strict_slashes=False)
def get_all_resources():
    season = request.args.get("season")
    resources = Resources.get_all_resources(season_id=season)
    return json.dumps(resources)


@views.route(
    "/api/users/<int:user_id>/resources", methods=["GET"], strict_slashes=False
)
def get_my_resources(user_id):
    season = request.args.get("season")
    resources = Resources.get_resources(user_id=user_id, season_id=season)
    return json.dumps(resources)


@views.route(
    "/api/resources/<int:resource_id>", methods=["PATCH"], strict_slashes=False
)
def edit_resource(resource_id):
    topic = request.json["topic"]
    level_id = request.json["level_id"]
    link = request.json["link"]
    Resources.update_resource(
        resource_id=resource_id, topic=topic, level_id=level_id, link=link
    )
    return "Success"


@views.route(
    "/api/resources/<int:resource_id>", methods=["DELETE"], strict_slashes=False
)
def delete_resource(resource_id):
    Resources.delete_resource(resource_id=resource_id)
    return "Success"


@views.route(urls["LEVELS"], methods=["GET"], strict_slashes=False)
def get_levels():
    levels = Levels.get_all_levels()
    return json.dumps(levels)


@views.route(urls["SEASONS"], methods=["GET"], strict_slashes=False)
def get_seasons():
    seasons = Seasons.get_all_seasons()
    return json.dumps(seasons)


@views.route(urls["REGISTRATION"], methods=["GET"], strict_slashes=False)
def get_registration_status():
    res = Vars.get_variable_value("registration")
    return res


@views.route(urls["REGISTRATION"], methods=["PUT"], strict_slashes=False)
def set_registration_status():
    value = request.json["registration"]
    Vars.set_variable_value("registration", value=value)
    return "Success"


@views.route("/api/users/<int:user_id>/mentor", methods=["GET"], strict_slashes=False)
def get_mentor(user_id):
    season = request.args.get("season_id")
    mentor = User.get_mentor_info(user_id=user_id, season_id=season)
    if mentor is not None:
        return mentor
    return ""


@views.route(
    "/api/users/<int:user_id>/registration-level", methods=["GET"], strict_slashes=False
)
def get_registration_level(user_id):
    level = Enrollment.get_enrollment_level(user_id=user_id)
    return json.dumps(level)
