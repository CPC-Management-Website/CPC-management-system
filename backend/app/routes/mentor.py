import json
from flask import Blueprint, request

from app.models import User


mentor = Blueprint("mentor", __name__, url_prefix="/mentors")


@mentor.route("/<int:mentor_id>/mentees", methods=["GET"], strict_slashes=False)
def get_mentees(mentor_id):
    season = request.args.get("season")
    print(mentor_id)
    users = User.get_mentees(mentor_id=mentor_id, season_id=season)

    return json.dumps(users)
