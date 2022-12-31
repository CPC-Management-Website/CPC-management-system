import sys
sys.path.append("..") 
from controller.website import db
from flask_login import UserMixin
from werkzeug.security import check_password_hash, generate_password_hash
from controller.website.email_api import sendPasswordResetEmail
import secrets
import datetime
from .vjudge_api import get_vjudge_data

password_length = 10

class User(UserMixin):
    id = None
    vjudge_handle = None
    name = None
    email = None
    level = None
    role_id = None
    active = None
    points = None
    password = None

    def __init__(self, email):
        mycursor = db.cursor(dictionary=True)
        query  = "SELECT `user_id`, `vjudge_handle`, \
                `name`, `email`, `level`, `user_role`, \
                `active`, `points`, `password` from user where email = %s;"
        mycursor.execute(query,(email,))
        record = mycursor.fetchone()
        self.id = record["user_id"]
        self.vjudge_handle = record["vjudge_handle"]
        self.name = record["name"]
        self.email = record["email"]
        self.level = record["level"]
        self.role_id = record["user_role"]
        self.active = record["active"]
        self.points = record["points"]
        self.password = record["password"]

    @staticmethod
    def getUserID(email):
        mycursor = db.cursor()
        query = "SELECT user_id FROM user where email=%s;"
        mycursor.execute(query,(email,))
        ID =  mycursor.fetchone()[0]
        return ID

    @staticmethod    
    def exists(email):
        mycursor = db.cursor()
        query = "SELECT * FROM user where email=%s;"
        mycursor.execute(query,(email,))
        mycursor.fetchone()
        print(mycursor.rowcount)
        if mycursor.rowcount ==1:
            return True
        return False
        # return bool(mycursor.rowcount)

    @staticmethod
    def addUser(vjudge_handle,name,email,level,role,active,points,password):
        mycursor = db.cursor()
        roleID = Permissions.getRoleID(role)
        query  = "INSERT INTO user \
                (`vjudge_handle`, `name`,\
                `email`, `level`, `user_role`, \
                `active`, `points`, `password`)\
                VALUES (%s,%s,%s,%s,%s,%s,%s,%s);"
        mycursor.execute(query,(vjudge_handle,name,email,level,roleID,active,points,password,))
        db.commit()



    @staticmethod
    def updatePassword(email,newPassword):       
        def isSamePassword(email,newPassword):
            mycursor = db.cursor(dictionary=True)
            query = "SELECT password FROM user where email=%s;"
            mycursor.execute(query,(email,))
            record = mycursor.fetchone()
            # print(record)
            # print(newPassword)
            if(check_password_hash(record['password'],newPassword)):
                return True
            else:
                return False

        if(User.exists(email)):
            if(isSamePassword(email,newPassword)):
                print("Password for",email,"is the same")
            else:
                mycursor = db.cursor()
                newPassword = generate_password_hash(newPassword, method='sha256')
                query = "UPDATE user SET password = %s WHERE (email = %s);"
                mycursor.execute(query,(newPassword,email,))
                # if(mycursor.rowcount)
                db.commit()
                if(mycursor.rowcount!=0):
                    print("Password for",email,"updated successfully")
                else:
                    print("Error Updating Password")      
                # print(mycursor.rowcount)
        else:
            print("Email doesn't exist")

    @staticmethod
    def getVjudge_Handles():
        mycursor = db.cursor()
        print("debugging")
        query  = "SELECT `user_id`, `vjudge_handle` from user;"
        mycursor.execute(query)
        columns = mycursor.column_names
        result = []
        for x in mycursor:
            result.append(dict(zip(columns,x)))
        # print (result)
        return result

    @staticmethod
    def getAllUsers(role):
        roleID = Permissions.getRoleID(role)
        mycursor = db.cursor(dictionary=True)
        query  = "SELECT `user_id`, `vjudge_handle`, `name`,\
                 `email` from user WHERE (user_role = %s);"
        mycursor.execute(query,(roleID,))
        records = mycursor.fetchall()
        users = []
        for record in records:
            users.append(record)
        return users

    @staticmethod
    def resetPassword(email):
        password = secrets.token_urlsafe(password_length)
        User.updatePassword(email,password)
        sendPasswordResetEmail(email,password)
    
    @staticmethod
    def updateData(email, name, vjudge_handle, password):
        User.updatePassword(email, password)
        mycursor = db.cursor()
        query = "UPDATE user SET vjudge_handle=%s, name=%s WHERE email=%s;"
        mycursor.execute(query, (vjudge_handle, name, email,))
        db.commit()
    
    @staticmethod
    def deleteUser(email):
        mycursor = db.cursor()
        query = "DELETE FROM user WHERE (`email` = %s);"
        mycursor.execute(query,(email,))
        db.commit()
    
class Permissions():

    def __init__(self,user:User):
        ID = user.role_id
        mycursor = db.cursor()
        query = "SELECT * from permission where role_id = %s;"
        mycursor.execute(query,(ID,))
        temp = dict(zip(mycursor.column_names, mycursor.fetchone()))
        for key in temp:
            setattr(self,key,temp[key])
    
    def getAllowedPermissions(self):
        allowedPermissions = []
        for attribute, value in self.__dict__.items():
            if value == True:
                allowedPermissions.append(attribute)
        return allowedPermissions

    @staticmethod
    def getRoleID(role):
        mycursor = db.cursor()
        stmt = "SELECT role_id from role where user_role = %s;"
        mycursor.execute(stmt,(role,))
        ID =  mycursor.fetchone()[0]
        return ID

    @staticmethod
    def getAllRoles():
        mycursor = db.cursor(dictionary=True)
        query  = "SELECT `role_id`, `user_role` from role;"
        mycursor.execute(query)
        records = mycursor.fetchall()
        roles = []
        for record in records:
            roles.append(record)
        return roles


class ProgressPerContest():
    # user_id = 0
    # contest_id = 0
    # solved_problems = 0
    # rank = 0
    # zone = "red"
    @staticmethod
    def getProblemCount(contest_id):
        # db.reconnect()
        mycursor = db.cursor(dictionary=True)
        query  = "SELECT `total_problems` from contest where contest_id = %s;"
        mycursor.execute(query,(contest_id,))
        record = mycursor.fetchone()
        return record['total_problems']
    
    @staticmethod
    def getZone(problemCount,solved):
        if solved < problemCount*0.25:
            return 'Red'
        if solved < problemCount*0.5:
            return 'Yellow'
        if solved < problemCount*0.75:
            return 'Green'
        return 'Blue'

    @staticmethod
    def addProgressPerContest(user_id, contest_id, solved_problems,zone):

        mycursor = db.cursor()
        query  = "INSERT INTO progress_per_contest \
                (`user_id`, `contest_id`,\
                `solved_problems`, `rank`, `zone`) \
                VALUES (%s,%s,%s,%s,%s);"
        mycursor.execute(query,(user_id,int(contest_id),solved_problems,0,zone,))
        db.commit()
    
    def __init__(self) -> None:
        print("in init")
    
    @staticmethod
    def getContest(contestID):
        mycursor = db.cursor(dictionary=True)
        query  = "SELECT `contest_id`, `week_number`, `topic`, `total_problems`,\
             `total_participants`, `minimum_problems` from contest where contest_id = %s;"
        mycursor.execute(query,(contestID,))
        record = mycursor.fetchone()
        return record

    @staticmethod
    def getUserProgress(email):
        ID = User.getUserID(email)
        mycursor = db.cursor(dictionary=True)
        query  = "SELECT `contest_id`, `solved_problems`, `rank`, `zone`\
             from progress_per_contest where user_id = %s;"
        mycursor.execute(query,(ID,))
        records = mycursor.fetchall()
        contests = []
        for record in records:
            contests.append(ProgressPerContest.getContest(record["contest_id"]))
        return {"progress": records, "contests" : contests}

    @staticmethod
    def contestExists(contest_ID):
        mycursor = db.cursor()
        query = "SELECT * FROM contest where contest_id=%s;"
        mycursor.execute(query,(contest_ID,))
        mycursor.fetchone()
        if mycursor.rowcount ==1:
            return True
        return False

    @staticmethod
    def addContest(contest_id, numProblems, start_date, end_date, topic, week_number):
        if(ProgressPerContest.contestExists(contest_id)):
            return "Contest already registered"
        dateFormat = "%d/%m/%Y"
        try:
            start_date = datetime.datetime.strptime(start_date, dateFormat)
            end_date = datetime.datetime.strptime(end_date, dateFormat)
        except:
            return "Incorrect date format"
        mycursor = db.cursor()
        query  = "INSERT INTO contest \
                (`contest_id`, `total_problems`,\
                `start_date`, `end_data`, `topic`,\
                `week_number`, `minimum_problems`, `total_participants`) \
                VALUES (%s,%s,%s,%s,%s,%s,%s,%s);"
        mycursor.execute(query,(contest_id, numProblems, start_date,
                 end_date, topic, week_number,numProblems, 0))
        db.commit()
        return "Success"

    @staticmethod
    def addProgress(contest_id):
        print("here")
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