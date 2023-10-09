from flask import Blueprint
from flask import request
from urls import urls
import json
# import sys
# # sys.path.append("..") 

from models import ProgressPerContest
import errors
import werkzeug

from models import User, Resources, Levels, Enrollment, Vars, Seasons


views = Blueprint("views", __name__)

@views.route(urls['PROFILE'], methods = ["GET"], strict_slashes=False)
def displayProfile():
    email = request.args.get("email")
    # if(User.exists(email)==False):
    #     return errors.email_doesnt_exist(werkzeug.exceptions.BadRequest)
    print (email)
    user = User(email = email)

    return json.dumps(user.__dict__)


def checkAvailablity(id,email,vjudge_handle):
    old_email = User.getUserEmail(user_id=id)
    if old_email!=email and User.email_exists(email=email):
        return errors.email_already_registered(werkzeug.exceptions.BadRequest)

    old_vjudge_handle = User.getVjudgeHandle(user_id=id)
    if old_vjudge_handle!=vjudge_handle and User.vjudge_handle_exists(vjudge_handle=vjudge_handle):
        return errors.vjudge_already_registered(werkzeug.exceptions.BadRequest)

@views.route(urls['PROFILE'], methods = ["POST"], strict_slashes=False)
def editProfile():

    id = request.json["userID"]
    email = request.json["email"]
    name = request.json["name"]
    vjudge_handle = request.json["vjudgeHandle"]
    password = request.json["password"]
    
    error = checkAvailablity(id=id,email=email,vjudge_handle=vjudge_handle)
    if error:
        return error
    User.updateData(id,email,name, vjudge_handle, password)

    return {"hereeee": "here"}

@views.route(urls['PROFILE_ADMIN'], methods = ["POST"], strict_slashes=False)
def editProfileAdmin():

    id = request.json["userID"]
    name = request.json["name"]
    vjudge_handle = request.json["vjudgeHandle"]
    email = request.json["email"]
    mentorID = request.json["mentorID"]
    enrollmentID = request.json["enrollmentID"]
    levelID = request.json["levelID"]
    seasonID = request.json["seasonID"]
    enrolled = request.json["enrolled"]

    error = checkAvailablity(id=id,email=email,vjudge_handle=vjudge_handle)
    if error:
        return error
    User.updateDataAdmin(id, name, vjudge_handle, email)
    if(enrollmentID):
        Enrollment.updateEnrollment(enrollment_id=enrollmentID,level_id=levelID, season_id=seasonID, mentor_id = mentorID, enrolled=enrolled)
    else:
        Enrollment.enroll(user_id=id,level_id=levelID)

    return {"hereeee": "here"}

@views.route(urls['USERS'], methods = ["GET"], strict_slashes=False)
def getUsers():
    role = request.args.get("role")
    season = request.args.get("season")
    users = User.getAllUsers(role = role, season_id=season)

    return json.dumps(users)

@views.route(urls['MENTEES'], methods = ["GET"], strict_slashes=False)
def getMentees():
    mentor_id = request.args.get("mentor_id")
    season = request.args.get("season")
    print(mentor_id)
    users = User.getMentees(mentorID=mentor_id,season_id=season)

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
    season = request.args.get("season")
    return ProgressPerContest.getUserProgress(email = email,season_id=season)


@views.route(urls['CONTEST'], methods = ["POST"], strict_slashes = False)
def addContest():
    contestID = request.json["contestID"]
    numOfProblems = request.json["numOfProblems"]
    yellowThreshold = request.json["yellowThreshold"]
    greenThreshold = request.json["greenThreshold"]
    topic = request.json["topic"]
    weekNum = request.json["weekNum"]
    levelID = request.json["levelID"]
    status = ProgressPerContest.addContest(contestID, numOfProblems, yellowThreshold, greenThreshold, topic, weekNum, levelID)
    print(status)
    if status == 'Contest already registered':
        return errors.contest_already_registered(werkzeug.exceptions.BadRequest)
    elif status == 'Incorrect date format':
        return errors.invalid_date_format(werkzeug.exceptions.BadRequest)
    ProgressPerContest.initContestProgress_contest(contest_id=contestID)
    # ProgressPerContest.updateProgress(contest_id=contestID)
    # ProgressPerContest.addProgress(contestID)
    return {"add contest": "in add contest"}

@views.route(urls['CONTEST'], methods = ["GET"], strict_slashes = False)
def getContests():
    season = request.args.get("season")
    return ProgressPerContest.getContestsAdmin(season=season)

@views.route(urls['CONTEST'], methods = ["PATCH"], strict_slashes = False)
def updateContest():
    new_contest_id = request.json["contest_id"]
    topic = request.json["topic"]
    yellow_threshold = request.json["yellow_threshold"]
    green_threshold = request.json["green_threshold"]
    total_problems = request.json["total_problems"]
    week_number = request.json["week_number"]
    level_id = request.json["level_id"]
    old_contest_id = request.json["old_contest_id"]
    try:
        ProgressPerContest.updateContest(new_contest_id,topic,yellow_threshold,green_threshold,total_problems,week_number,level_id,old_contest_id)
    except Exception as e:
        print(e)
        return errors.contest_already_registered(werkzeug.exceptions.BadRequest)
    return "Success"

@views.route(urls['CONTEST'], methods = ["DELETE"], strict_slashes = False)
def deleteContest():
    contest_id = request.args.get("contest_id")
    ProgressPerContest.deleteContest(contest_id=contest_id)
    return "Success"

@views.route(urls["RESOURCES"], methods = ["POST"], strict_slashes = False)
def addResource():
    resourceTopic = request.json["resourceTopic"]
    resourceLink = request.json["resourceLink"]
    resourceLevel = request.json["resourceLevel"]
    resourceSeason = request.json["seasonID"]
    Resources.addResource(topic=resourceTopic, link=resourceLink, level=resourceLevel,season_id=resourceSeason)
    return ""

@views.route(urls["RESOURCES"], methods = ["GET"], strict_slashes = False)
def getAllResources():
    season = request.args.get("season")
    resources = Resources.getAllResources(season_id=season)
    return json.dumps(resources)

@views.route(urls["MYRESOURCES"], methods = ["GET"], strict_slashes = False)
def getMyResources():
    user_id = request.args.get("user_id")
    season = request.args.get("season")
    resources = Resources.getResources(user_id=user_id,season_id=season)
    return json.dumps(resources)

@views.route(urls['RESOURCES'], methods = ["PATCH"], strict_slashes=False)
def editResource():
    id = request.json["resource_id"]
    topic = request.json["topic"]
    level_id = request.json["level_id"]
    link = request.json["link"]
    Resources.updateResource(id=id,topic=topic,level_id=level_id,link=link)
    return "Success"

@views.route(urls['RESOURCES'], methods = ["DELETE"], strict_slashes=False)
def deleteResource():
    id = request.args.get("resource_id")
    Resources.deleteResource(id=id)
    return "Success"

@views.route(urls["LEVELS"], methods = ["GET"], strict_slashes=False)
def getLevels():
    levels = Levels.getAllLevels()
    return json.dumps(levels)

@views.route(urls["SEASONS"], methods = ["GET"], strict_slashes=False)
def getSeasons():
    seasons = Seasons.getAllSeasons()
    return json.dumps(seasons)

@views.route(urls["REGISTRATION"], methods = ["GET"], strict_slashes=False)
def getRegistrationStatus():
    res = Vars.getVariableValue("registration")
    return res

@views.route(urls["REGISTRATION"], methods = ["POST"], strict_slashes=False)
def setRegistrationStatus():
    value = request.json["registration"]
    Vars.setVariableValue("registration",value=value)
    return "Success"

@views.route(urls["MENTOR"], methods = ["GET"], strict_slashes = False)
def getMentor():
    user_id = request.args.get("user_id")
    season = request.args.get("season_id")
    mentor = User.getMentorInfo(user_id=user_id,season_id=season)
    if mentor is not None:
        return mentor
    return ""

@views.route(urls["REGISTRATION_LEVEL"], methods = ["GET"], strict_slashes = False)
def getRegistrationLevel():
    user_id = request.args.get("user_id")
    level = Enrollment.getEnrollmentLevel(user_id=user_id)
    return json.dumps(level)