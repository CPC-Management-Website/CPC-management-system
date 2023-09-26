
import werkzeug.exceptions
from flask import Blueprint

errors = Blueprint("errors", __name__)

@errors.errorhandler(werkzeug.exceptions.BadRequest)
def email_doesnt_exist(e):
    return {"Error":'Email does not exist'}, 401

@errors.errorhandler(werkzeug.exceptions.BadRequest)
def incorrect_password(e):
    return {"Error":'Incorrect Password'}, 402

@errors.errorhandler(werkzeug.exceptions.BadRequest)
def email_already_registered(e):
    return {"Error":'This email is already registered'}, 403

@errors.errorhandler(werkzeug.exceptions.BadRequest)
def vjudge_already_registered(e):
    return {"Error":'This vjudge handle is already registered'}, 403

@errors.errorhandler(werkzeug.exceptions.BadRequest)
def user_already_registered_bulk(already_registered,e):
    message = "These users have either emails or vjudge handles that are already registered:\n"
    for email in already_registered:
        message+=email+"\n"
    print(message)
    return {"Error":message}, 405

@errors.errorhandler(werkzeug.exceptions.BadRequest)
def emails_do_not_exist(nonexistant_emails,e):
    message = "These emails either do not exist or there is no mentor with the given email on the system or the trainee or mentor is not registered in the current season:\n"
    for email in nonexistant_emails:
        message+=email+"\n"
    print(message)
    return {"Error":message}, 405

@errors.errorhandler(werkzeug.exceptions.BadRequest)
def contest_already_registered(e):
    return {"Error":'This contest ID is already registered'}, 406

@errors.errorhandler(werkzeug.exceptions.BadRequest)
def invalid_date_format(e):
    return {"Error":'Invalid date format'}, 411

@errors.errorhandler(werkzeug.exceptions.BadRequest)
def user_already_enrolled(e):
    return {"Error":'User already enrolled in current season'}, 412