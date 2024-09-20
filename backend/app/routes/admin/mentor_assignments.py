from flask import Blueprint, request
import pandas as pd

from app import errors
from app.models import Enrollment, User


mentor_assignment = Blueprint(
    "mentor_assignment", __name__, url_prefix="/mentor-assignments"
)


@mentor_assignment.route("/", methods=["POST"], strict_slashes=False)
def assign_mentors():
    file = request.files.get("excel-file")
    df = pd.DataFrame(pd.read_excel(file))
    nonexistent_emails = []
    for index, row in df.iterrows():
        index += 2
        trainee_email = row["Email"]
        mentor_email = row["Mentor Email"]
        # print(name,email,password)
        if not User.email_exists(email=trainee_email):
            nonexistent_emails.append(trainee_email)
        elif not User.email_exists(email=mentor_email):
            nonexistent_emails.append(mentor_email)
        elif User.get_user_role_name(email=mentor_email) != "Mentor":
            nonexistent_emails.append(mentor_email)
        elif not Enrollment.is_enrolled(User.get_user_id(email=trainee_email)):
            nonexistent_emails.append(trainee_email)
        elif not Enrollment.is_enrolled(User.get_user_id(email=mentor_email)):
            nonexistent_emails.append(mentor_email)
        else:
            User.assign_mentor(trainee_email=trainee_email, mentor_email=mentor_email)

    if len(nonexistent_emails) > 0:
        return errors.emails_do_not_exist(nonexistent_emails)
    return " "
