from flask import Blueprint
from flask import request
import sys
sys.path.append("..") 

from vjudge_api import get_vjudge_data
from model.models import ProgressPerContest
from website import errors
import werkzeug
from . import db
from .__init__ import urls

from model.models import User
import json

views = Blueprint("views", __name__)

@views.route(urls['PROGRESS_PER_CONTEST'], methods=["POST"], strict_slashes=False)
def get_progress_per_contest():
    print("here")
    contest_id = request.json["contestID"]
    print(contest_id)
    problemCount = ProgressPerContest.getProblemCount(contest_id=contest_id)
    print('#Problems:',problemCount)
    trainees = User.getVjudge_Handles()
    for trainee in trainees:
        id = trainee["user_id"]
        vjudge = trainee["vjudge_handle"]
        print(id, vjudge)
        res = get_vjudge_data(contest_id = contest_id,username=vjudge,result=1)
        filtered_res = {}
        for x in res:
            filtered_res[(x['problemId'],x['userName'])] = x
            #print(x)
        numSolved = len(filtered_res)
        print("Solved:",numSolved)
        zone = ProgressPerContest.getZone(problemCount=problemCount,solved=numSolved)
        print(zone)
        ProgressPerContest.addProgressPerContest(id,contest_id,numSolved,zone)
    return " "

@views.route(urls['PROFILE'], methods = ["GET"], strict_slashes=False)
def displayProfile():
    email = request.args.get("email")
    # if(User.exists(email)==False):
    #     return errors.email_doesnt_exist(werkzeug.exceptions.BadRequest)
    print (email)
    user = User(email = email)

#     #return user as json object
#    return user.json.dumps(user._dict_)
    ret = json.dumps(user.__dict__)
    # console.log ("heeellooooo")
    print (ret)
    return json.dumps(user.__dict__)


@views.route(urls['PROFILE'], methods = ["POST"], strict_slashes=False)
def editProfile():

    email = request.json["email"]
    name = request.json["name"]
    vjudge_handle = request.json["vjudgeHandle"]
    password = request.json["password"]
    
    User.updateData(email,name, vjudge_handle, password)
    #how to redirect to profile after update?
    #redirect ('/profile')
    return {"hereeee": "here"}

@views.route(urls['USERS'], methods = ["GET"], strict_slashes=False)
def getUsers():
    print('in method')
    role = request.args.get("role")
    print(role)
    users = User.getAllUsers(role)

    return json.dumps(users)

@views.route(urls['TRANSCRIPT'], methods = ["POST"], strict_slashes=False)
def displayTranscript():
    email = request.json["email"]
    print(email)
    return ProgressPerContest.getUserProgress(email)


@views.route(urls['CONTEST'], methods = ["POST"], strict_slashes = False)
def addContest():
    contestID = request.json["contestID"]
    numOfProblems = request.json["numOfProblems"]
    startDate = request.json["startDate"]
    endDate = request.json["endDate"]
    topic = request.json["topic"]
    weekNum = request.json["weekNum"]

    return {"add contest": "in add contest"}