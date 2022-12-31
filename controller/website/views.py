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

    user = User(email=email)
    print (email)
    return {"email" : user.email, "vjudge_handle" : user.vjudge_handle, "name" : user.name}


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

    return {json.dumps(users)}

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