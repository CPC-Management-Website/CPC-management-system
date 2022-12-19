from flask import Blueprint
from flask import Blueprint, request
from Vjudge_api import get_vjudge_data
from .models import ProgressPerContest
from . import db
from .__init__ import urls

views = Blueprint("views", __name__)

@views.route(urls.PROGRESS_PER_CONTEST, methods=["POST"], strict_slashes=False)
def get_progress_per_contest():
    contest_id = request.json["contestID"]

    res = get_vjudge_data(contest_id = contest_id, limit=10)
    #print(res)

    # removing duplicates accepted for the same problem and user
    print("here1")
    mycursor = db.cursor()
    query  = "INSERT INTO training.progress_per_contest_2 (`zone`) VALUES ('RED');"
    #record = (user_id, contest_id, solved_problems, rank, zone)
    mycursor.execute(query)
    #mycursor.execute(query)
    print("here2")
    db.commit()
    print("here")

    
    #ProgressPerContest.addProgressPerContest(26, 10, 3, 50, "GREEN")

    return res


