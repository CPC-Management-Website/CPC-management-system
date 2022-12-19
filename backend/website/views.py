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

    res = get_vjudge_data(contest_id = contest_id)
    filtered_res = {}
    for x in res:
        filtered_res[(x['problemId'],x['userName'])] = x
        #print(x)

    for x in filtered_res:
        print (x)

    return res