from . import db
from flask_login import UserMixin

class User(UserMixin):
    id = None
    vjudge_handle = None
    name = None
    email = None
    level = None
    type = None
    active = None
    points = None
    password = None
    
    def get_id(self):
        return self.id

    def __init__(self, email):
        mycursor = db.cursor()
        query = "SELECT * FROM user where email=\""+email+"\""
        mycursor.execute(query)
    def __init__(self, email,vjudge_handle,password):
        self.email = email
        self.password = password
        self.vjudge_handle = vjudge_handle
    
    def get_id(self):
        return self.email
        
    @staticmethod    
    def exists(email):
        mycursor = db.cursor()
        query = "SELECT * FROM user where email=\""+email+"\""
        mycursor.execute(query)
        for x in mycursor:
            print(x)
        if mycursor.rowcount ==-1:
            return False
        return True
        # return bool(mycursor.rowcount)

    @staticmethod
    def addUser(email, vjudge_handle, password):
        mycursor = db.cursor()
        query  = "INSERT INTO training.user (`email`, `vjudge_handle`,`type`,`password`) VALUES ('" +email+"','"+vjudge_handle+"','trainee','"+password+"');"
        mycursor.execute(query)
        db.commit()
        print("here")
    @staticmethod
    def getUser(email):
        mycursor = db.cursor()
        query  = "SELECT `email` ,`vjudge_handle`, `password` from user where email = \""+email+"\""
        mycursor.execute(query)
        user = None
        for x in mycursor:
            user = User(x[0],x[1],x[2])
        return user
    
