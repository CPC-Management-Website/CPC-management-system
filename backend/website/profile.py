from . import db
from flask import Blueprint, request

#this method shall be called by email?
#@app.route('/profile/edit/<email>', methods = ["POST, GET"])
def editProfile(email):
    if request.method == "POST":

        #if post, won't update email?
        #email = request.json["email"]
        vjudge_handle = request.json["vjudge_handle"]
        name = request.json["name"]
        password = request.json["password"]
   
        mycursor = db.cursor()
        query = "UPDATE user SET email=%s, vjudge_handle=%s, name=%s, password=%s WHERE email=%s"
        mycursor.execute(query, (email, vjudge_handle, name, password, email))
        db.commit()
        #how to redirect to profile after update?
        #return redirect ('/profile')

    mycursor = db.cursor()
    query = "SELECT * FROM user where email=%s;"
    mycursor.execute(query,[email])
    user = mycursor.fetchone()

    #return user to be displayed?
    return user
