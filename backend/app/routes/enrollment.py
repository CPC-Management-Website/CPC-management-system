from flask import Blueprint, request

from app import errors
from app.models import Enrollment, Seasons, Vars


enrollment = Blueprint("enrollment", __name__, url_prefix="/enrollments")


@enrollment.route("/", methods=["POST"], strict_slashes=False)
def enroll_from_json():
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
