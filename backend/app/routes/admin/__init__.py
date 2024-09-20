import json
from flask import Blueprint, request

from app.models import Levels, Permissions, Vars

from app.routes.admin.contest import contest
from app.routes.admin.enrollment import enrollment
from app.routes.admin.mentor_assignments import mentor_assignment
from app.routes.admin.resource import resource
from app.routes.admin.user import user

admin = Blueprint("admin", __name__, url_prefix="/admin")

admin.register_blueprint(contest)
admin.register_blueprint(enrollment)
admin.register_blueprint(mentor_assignment)
admin.register_blueprint(resource)
admin.register_blueprint(user)


@admin.route("/levels", methods=["GET"], strict_slashes=False)
def get_levels():
    levels = Levels.get_all_levels()
    return json.dumps(levels)


@admin.route("/roles", methods=["GET"], strict_slashes=False)
def get_roles():
    roles = Permissions.get_all_roles()
    return json.dumps(roles)


@admin.route("/registration-status", methods=["PUT"], strict_slashes=False)
def set_registration_status():
    value = request.json["registration"]
    Vars.set_variable_value("registration", value=value)
    return "Success"
