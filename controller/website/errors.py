
import werkzeug.exceptions
from flask import Blueprint

errors = Blueprint("errors", __name__)

@errors.errorhandler(werkzeug.exceptions.BadRequest)
def email_doesnt_exist(e):
    return {"Error":'Email does not exist'}, 401

@errors.errorhandler(werkzeug.exceptions.BadRequest)
def incorrect_password(e):
    return {"Error":'Incorrect Password'}, 402