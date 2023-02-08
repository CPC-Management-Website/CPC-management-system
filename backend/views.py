from flask import Blueprint
from flask import request
from urls import urls
import json
# import sys
# # sys.path.append("..") 

from models import ProgressPerContest
import errors
import werkzeug

from models import User, Resources


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

    id = request.json["userID"]
    email = request.json["email"]
    name = request.json["name"]
    vjudge_handle = request.json["vjudgeHandle"]
    password = request.json["password"]
    
    User.updateData(id,email,name, vjudge_handle, password)

    return {"hereeee": "here"}

@views.route(urls['PROFILE_ADMIN'], methods = ["POST"], strict_slashes=False)
def editProfileAdmin():

    id = request.json["userID"]
    name = request.json["name"]
    vjudge_handle = request.json["vjudgeHandle"]
    email = request.json["email"]
    level = request.json["level"]
    mentorID = request.json["mentorID"]
    enrolled = request.json["enrolled"]
    
    User.updateDataAdmin(id, name, vjudge_handle, email, level, mentorID, enrolled)

    return {"hereeee": "here"}

@views.route(urls['USERS'], methods = ["GET"], strict_slashes=False)
def getUsers():
    role = request.args.get("role")
    print(role)
    users = User.getAllUsers(role)

    return json.dumps(users)

@views.route(urls['USERS'], methods = ["PATCH"], strict_slashes=False)
def restUserPassword():
    user_id = request.json["user_id"]
    User.resetPassword(user_id)
    print("Reset password for ",user_id)
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
    yellowThreshold = request.json["yellowThreshold"]
    greenThreshold = request.json["greenThreshold"]
    topic = request.json["topic"]
    weekNum = request.json["weekNum"]
    status = ProgressPerContest.addContest(contestID, numOfProblems, yellowThreshold, greenThreshold, topic, weekNum)
    print(status)
    if status == 'Contest already registered':
        return errors.contest_already_registered(werkzeug.exceptions.BadRequest)
    elif status == 'Incorrect date format':
        return errors.invalid_date_format(werkzeug.exceptions.BadRequest)
    ProgressPerContest.register_contestants(contest_id=contestID)
    # ProgressPerContest.addProgress(contestID)
    return {"add contest": "in add contest"}

@views.route(urls["RESOURCES"], methods = ["POST"], strict_slashes = False)
def addResource():
    resourceTopic = request.json["resourceTopic"]
    resourceLink = request.json["resourceLink"]
    resourceLevel = request.json["resourceLevel"]
    Resources.addResource(topic=resourceTopic, link=resourceLink, level=resourceLevel)
    return ""

@views.route(urls["RESOURCES"], methods = ["GET"], strict_slashes = False)
def getResources():
    resources = Resources.getAllResources()
    return json.dumps(resources)

@views.route(urls['RESOURCES'], methods = ["PATCH"], strict_slashes=False)
def editResource():
    id = request.json["resource_id"]
    topic = request.json["newTopic"]
    level = request.json["newLevel"]
    link = request.json["newLink"]
    Resources.updateResource(id=id,topic=topic,level=level,link=link)
    return "Success"

@views.route(urls['RESOURCES'], methods = ["DELETE"], strict_slashes=False)
def deleteResource():
    id = request.args.get("resource_id")
    Resources.deleteResource(id=id)
    return "Success"