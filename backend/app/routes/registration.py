from flask import Blueprint

from app.models import Vars


registration_status = Blueprint(
    "registration", __name__, url_prefix="/registration-status"
)


@registration_status.route("/", methods=["GET"], strict_slashes=False)
def get_registration_status():
    res = Vars.get_variable_value("registration")
    return res
