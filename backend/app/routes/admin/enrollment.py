from flask import Blueprint, request
import pandas as pd

from app import errors
from app.models import Enrollment, Levels, Permissions, User


enrollment = Blueprint("enrollment", __name__, url_prefix="/enrollments")


@enrollment.route("/", methods=["POST"], strict_slashes=False)
def enroll_from_file():
    roles = Permissions.get_all_roles()
    levels = Levels.get_all_levels()
    file = request.files.get("excel-file")
    df = pd.DataFrame(pd.read_excel(file))
    nonexistent_emails = []
    for index, row in df.iterrows():
        index += 2
        email = row["Email"]
        role_name = row["Role"]
        res = [role for role in roles if role["user_role"] == role_name]
        role_id = res[0]["role_id"]
        level_name = row["Level"]
        res2 = [level for level in levels if level["name"] == level_name]
        level_id = res2[0]["level_id"]
        # print(name,email,password)
        if not User.email_exists(email=email):
            nonexistent_emails.append(email)
            continue
        user = User(email)
        enrollment = Enrollment.get_enrollment(user_id=user.id)
        print(enrollment)
        print(level_name)
        print(level_id)
        if enrollment is not None:
            Enrollment.update_enrollment_from_file(
                enrollment["enrollment_id"],
                level_id=level_id,
                mentor_id=None,
                enrolled=True,
                role_id=role_id,
            )
        else:
            Enrollment.enroll(user_id=user.id, level_id=level_id, role_id=role_id)

    if len(nonexistent_emails) > 0:
        return errors.emails_do_not_exist_register_file(nonexistent_emails)
    return " "
