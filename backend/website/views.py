from flask import Blueprint
from flask import request
from Vjudge_api import get_vjudge_data
from .models import ProgressPerContest
from . import db
from .__init__ import urls
from .models import User

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


#this method shall be called by email?
#@views.route('/profile/edit/<email>', methods = ["POST, GET"])
#@views.route(urls.PROFILE, methods = ["POST, GET"], strict_slashes=False)
def editProfile(email):
    if request.method == "POST":

        #if post, won't update email?
        #email = request.json["email"]
        vjudge_handle = request.json["vjudge_handle"]
        name = request.json["name"]
        password = request.json["password"]

        User.changePasswordAdmin(email, password)
        mycursor = db.cursor()
        query = "UPDATE user SET vjudge_handle=%s, name=%s WHERE email=%s"
        mycursor.execute(query, (vjudge_handle, name, email))
        db.commit()
        #how to redirect to profile after update?
        #return redirect ('/profile')

    mycursor = db.cursor()
    user = User(email)

    #return user object to be displayed?
    return user