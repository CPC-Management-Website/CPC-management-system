from flask import Blueprint

from app.routes.auth import auth
from app.routes.enrollment import enrollment
from app.routes.mentor import mentor
from app.routes.registration import registration_status
from app.routes.user import user


normal_route = Blueprint("normal_route", __name__)

normal_route.register_blueprint(auth)
normal_route.register_blueprint(enrollment)
normal_route.register_blueprint(mentor)
normal_route.register_blueprint(registration_status)
normal_route.register_blueprint(user)
