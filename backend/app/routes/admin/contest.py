from flask import Blueprint, request

from app import errors
from app.models import ProgressPerContest


contest = Blueprint("contest", __name__, url_prefix="/contests")


@contest.route("/", methods=["POST"], strict_slashes=False)
def add_contest():
    contest_id = request.json["contestID"]
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


@contest.route("/", methods=["GET"], strict_slashes=False)
def get_contests():
    season = request.args.get("season")
    return ProgressPerContest.get_contests_admin(season=season)


# TODO consider changing how this route deals with changing contest id
@contest.route("/<int:old_contest_id>", methods=["PATCH"], strict_slashes=False)
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


@contest.route("/<int:contest_id>", methods=["DELETE"], strict_slashes=False)
def delete_contest(contest_id):
    ProgressPerContest.delete_contest(contest_id=contest_id)
    return "Success"
