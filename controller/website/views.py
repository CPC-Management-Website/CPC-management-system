from flask import Blueprint
from flask import request
import sys
sys.path.append("..") 

from model.models import ProgressPerContest
from website import errors
import werkzeug
from . import db
from .__init__ import urls

from model.models import User
import json

views = Blueprint("views", __name__)

@views.route(urls['PROFILE'], methods = ["GET"], strict_slashes=False)
def displayProfile():
    email = request.args.get("email")
    # if(User.exists(email)==False):
    #     return errors.email_doesnt_exist(werkzeug.exceptions.BadRequest)
    print (email)
    user = User(email = email)

    return json.dumps(user.__dict__)


@views.route(urls['PROFILE'], methods = ["POST"], strict_slashes=False)
def editProfile():

    email = request.json["email"]
    name = request.json["name"]
    vjudge_handle = request.json["vjudgeHandle"]
    password = request.json["password"]
    
    User.updateData(email,name, vjudge_handle, password)

    return {"hereeee": "here"}

@views.route(urls['USERS'], methods = ["GET"], strict_slashes=False)
def getUsers():
    role = request.args.get("role")
    print(role)
    users = User.getAllUsers(role)

    return json.dumps(users)

@views.route(urls['USERS'], methods = ["PATCH"], strict_slashes=False)
def restUserPassword():
    email = request.json["email"]
    User.resetPassword(email)
    print("Reset password for ",email)
    return "Success"

@views.route(urls['USERS'], methods = ["DELETE"], strict_slashes=False)
def deletUser():
    email = request.args.get("email")
    User.deleteUser(email)
    print("Deleted user",email)
    return "Success"

@views.route(urls['TRANSCRIPT'], methods = ["GET"], strict_slashes=False)
def displayTranscript():
    email = request.args.get("email")
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
    status = ProgressPerContest.addContest(contestID, numOfProblems, startDate, endDate, topic, weekNum)
    print(status)
    if status == 'Contest already registered':
        return errors.contest_already_registered(werkzeug.exceptions.BadRequest)
    elif status == 'Incorrect date format':
        return errors.invalid_date_format(werkzeug.exceptions.BadRequest)
    ProgressPerContest.addProgress(contestID)
    return {"add contest": "in add contest"}