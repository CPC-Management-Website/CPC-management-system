
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
def email_already_registered_bulk(already_registered,e):
    message = "These emails are already registered:\n"
    for email in already_registered:
        message+=email+"\n"
    print(message)
    return {"Error":message}, 405

@errors.errorhandler(werkzeug.exceptions.BadRequest)
def contest_already_registered(e):
    return {"Error":'This contest ID is already registered'}, 406

@errors.errorhandler(werkzeug.exceptions.BadRequest)
def invalid_date_format(e):
    return {"Error":'Invalid date format'}, 407