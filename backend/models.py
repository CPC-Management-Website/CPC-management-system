from flask_login import UserMixin
from werkzeug.security import check_password_hash, generate_password_hash
from APIs.email_api import sendPasswordResetEmail
import secrets
import datetime
from APIs.vjudge_api import getProgress
from flask import g

password_length = 10

class User(UserMixin):
    id = None
    vjudge_handle = None
    name = None
    email = None
    level = None
    role_id = None
    enrolled = None
    points = None
    password = None

    def __init__(self, email):
        mycursor = g.db.cursor(dictionary=True)
        query  = "SELECT `user_id`, `vjudge_handle`, \
                `name`, `email`, `level`, `user_role`, \
                `enrolled`, `points`, `password` from user where email = %s;"
        mycursor.execute(query,(email,))
        record = mycursor.fetchone()
        self.id = record["user_id"]
        self.vjudge_handle = record["vjudge_handle"]
        self.name = record["name"]
        self.email = record["email"]
        self.level = record["level"]
        self.role_id = record["user_role"]
        self.enrolled = record["enrolled"]
        self.points = record["points"]
        self.password = record["password"]

    @staticmethod
    def getUserID(email):
        mycursor = g.db.cursor()
        query = "SELECT user_id FROM user where email=%s;"
        mycursor.execute(query,(email,))
        ID =  mycursor.fetchone()[0]
        return ID

    @staticmethod
    def getUserEmail(user_id):
        mycursor = g.db.cursor()
        query = "SELECT email FROM user where user_id=%s;"
        mycursor.execute(query,(user_id,))
        email =  mycursor.fetchone()[0]
        return email

    @staticmethod    
    def email_exists(email):
        mycursor = g.db.cursor()
        query = "SELECT * FROM user where email=%s;"
        mycursor.execute(query,(email,))
        mycursor.fetchone()
        if mycursor.rowcount ==1:
            return True
        return False
        # return bool(mycursor.rowcount)
    
    @staticmethod    
    def id_exists(id):
        mycursor = g.db.cursor()
        query = "SELECT * FROM user where user_id=%s;"
        mycursor.execute(query,(id,))
        mycursor.fetchone()
        if mycursor.rowcount ==1:
            return True
        return False
        # return bool(mycursor.rowcount)

    @staticmethod
    def addUser(vjudge_handle,name,email,level,roleID,enrolled,points,password):
        mycursor = g.db.cursor()
        # roleID = Permissions.getRoleID(role)
        query  = "INSERT INTO user \
                (`vjudge_handle`, `name`,\
                `email`, `level`, `user_role`, \
                `enrolled`, `points`, `password`)\
                VALUES (%s,%s,%s,%s,%s,%s,%s,%s);"
        mycursor.execute(query,(vjudge_handle,name,email,level,roleID,enrolled,points,password,))
        g.db.commit()



    @staticmethod
    def updatePassword(user_id,newPassword):       
        def isSamePassword(id,newPassword):
            mycursor = g.db.cursor(dictionary=True)
            query = "SELECT password FROM user where user_id=%s;"
            mycursor.execute(query,(id,))
            record = mycursor.fetchone()
            # print(record)
            # print(newPassword)
            if(check_password_hash(record['password'],newPassword)):
                return True
            else:
                return False

        if(User.id_exists(user_id)):
            if(isSamePassword(user_id,newPassword)):
                print("Password for",user_id,"is the same")
            else:
                mycursor = g.db.cursor()
                newPassword = generate_password_hash(newPassword, method='sha256')
                query = "UPDATE user SET password = %s WHERE (user_id = %s);"
                mycursor.execute(query,(newPassword,user_id,))
                # if(mycursor.rowcount)
                g.db.commit()
                if(mycursor.rowcount!=0):
                    print("Password for",user_id,"updated successfully")
                else:
                    print("Error Updating Password")      
                # print(mycursor.rowcount)
        else:
            print("Email doesn't exist")

    @staticmethod
    def getVjudge_Handles():
        mycursor = g.db.cursor()
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
        mycursor = g.db.cursor(dictionary=True)
        query  = "SELECT distinct\
                u.user_id,\
                u.vjudge_handle,\
                u.name,\
                u.email,\
                u.level,\
                u.enrolled,\
                u.mentor_id,\
                m.name as mentor_name\
                from (user u) \
                left join user m on (u.mentor_id = m.user_id)\
                WHERE (u.user_role = %s);"
        mycursor.execute(query,(roleID,))
        records = mycursor.fetchall()
        users = []
        for record in records:
            users.append(record)
        return users

    @staticmethod
    def resetPassword(user_id):
        password = secrets.token_urlsafe(password_length)
        User.updatePassword(user_id = user_id,newPassword = password)
        email = User.getUserEmail(user_id=user_id)
        sendPasswordResetEmail(email,password)
    
    @staticmethod
    def updateData(id,email, name, vjudge_handle, password):
        User.updatePassword(user_id = id, newPassword = password)
        mycursor = g.db.cursor()
        query = "UPDATE user SET email = %s, vjudge_handle=%s, name=%s WHERE user_id=%s;"
        mycursor.execute(query, (email, vjudge_handle, name, id,))
        g.db.commit()
    
    @staticmethod
    def updateDataAdmin(id, name, vjudge_handle, email, level, mentorID, enrolled):
        mycursor = g.db.cursor()
        query = "UPDATE user SET name=%s, vjudge_handle=%s, email=%s, level=%s, mentor_id=%s, enrolled=%s WHERE user_id=%s;"
        mycursor.execute(query, (name,vjudge_handle,email,level,mentorID,enrolled,id,))
        g.db.commit()
    
    @staticmethod
    def deleteUser(email):
        mycursor = g.db.cursor()
        query = "DELETE FROM user WHERE (`email` = %s);"
        mycursor.execute(query,(email,))
        g.db.commit()
    
class Permissions():

    def __init__(self,user:User):
        ID = user.role_id
        mycursor = g.db.cursor()
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
        mycursor = g.db.cursor()
        stmt = "SELECT role_id from role where user_role = %s;"
        mycursor.execute(stmt,(role,))
        ID =  mycursor.fetchone()[0]
        return ID

    @staticmethod
    def getAllRoles():
        mycursor = g.db.cursor(dictionary=True)
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
        # g.db.reconnect()
        mycursor = g.db.cursor(dictionary=True)
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

        mycursor = g.db.cursor()
        query  = "INSERT INTO progress_per_contest \
                (`user_id`, `contest_id`,\
                `solved_problems`, `rank`, `zone`) \
                VALUES (%s,%s,%s,%s,%s);"
        mycursor.execute(query,(user_id,int(contest_id),solved_problems,0,zone,))
        g.db.commit()
    
    @staticmethod
    def addProgressPerContestBulk(progressList):
        mycursor = g.db.cursor()
        query  = "INSERT INTO progress_per_contest \
                (`user_id`, `contest_id`,\
                `solved_problems`, `rank`, `zone`) \
                VALUES (%s,%s,%s,%s,%s);"
        mycursor.executemany(query,progressList)
        g.db.commit()
    
    def __init__(self) -> None:
        print("in init")
    
    @staticmethod
    def getContest(contestID):
        mycursor = g.db.cursor(dictionary=True)
        query  = "SELECT `contest_id`, `week_number`, `topic`, `total_problems`,\
             `total_participants`, `minimum_problems` from contest where contest_id = %s;"
        mycursor.execute(query,(contestID,))
        record = mycursor.fetchone()
        return record


    @staticmethod
    def getAllContests():
        mycursor = g.db.cursor(dictionary=True)
        query  = "SELECT * from contest;"
        mycursor.execute(query)
        contests = mycursor.fetchall()
        return contests

    @staticmethod
    def getUserProgress(email):
        ID = User.getUserID(email)
        mycursor = g.db.cursor(dictionary=True)
        query  = "SELECT `contest_id`, `solved_problems`, `rank`, `zone`\
             from progress_per_contest where user_id = %s;"
        mycursor.execute(query,(ID,))
        records = mycursor.fetchall()
        contests = ProgressPerContest.getAllContests()
        return {"progress": records, "contests" : contests}

    @staticmethod
    def contestExists(contest_ID):
        mycursor = g.db.cursor()
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
        dateFormat = "%Y-%m-%d"
        try:
            start_date = datetime.datetime.strptime(start_date, dateFormat)
            end_date = datetime.datetime.strptime(end_date, dateFormat)
        except:
            return "Incorrect date format"
        mycursor = g.db.cursor()
        query  = "INSERT INTO contest \
                (`contest_id`, `total_problems`,\
                `start_date`, `end_date`, `topic`,\
                `week_number`, `minimum_problems`, `total_participants`) \
                VALUES (%s,%s,%s,%s,%s,%s,%s,%s);"
        mycursor.execute(query,(contest_id, numProblems, start_date,
                 end_date, topic, week_number,numProblems, 0))
        g.db.commit()
        return "Success"

    @staticmethod
    def addProgress(contest_id):
        print("here")
        print(contest_id)
        problemCount = ProgressPerContest.getProblemCount(contest_id=contest_id)
        print('#Problems:',problemCount)
        trainees = User.getVjudge_Handles()
        res = getProgress(contest_id=contest_id)
        print(dict(res))
        progressList = []
        for trainee in trainees:
            id = trainee["user_id"]
            vjudge = trainee["vjudge_handle"]
            print(id, vjudge)         
            numSolved = res[vjudge]
            print("Solved:",numSolved)
            zone = ProgressPerContest.getZone(problemCount=problemCount,solved=numSolved)
            print(zone)
            progressList.append((id,contest_id,numSolved,0,zone)) #the zero here is a temporary number for user rank in contest
            # ProgressPerContest.addProgressPerContest(id,contest_id,numSolved,zone)
        ProgressPerContest.addProgressPerContestBulk(progressList = progressList)
        return " "

class Resources():
    
    @staticmethod
    def addResource(topic,link,level):
        mycursor = g.db.cursor()
        query  = "INSERT INTO resource \
                (`topic`, `link`,`level`) \
                VALUES (%s,%s,%s);"
        mycursor.execute(query,(topic,link,int(level),))
        g.db.commit()

    @staticmethod
    def getAllResources():
        mycursor = g.db.cursor(dictionary=True)
        query  = "SELECT * from resource;"
        mycursor.execute(query)
        records = mycursor.fetchall()
        resources = []
        for record in records:
            resources.append(record)
        return resources
    
    @staticmethod
    def updateResource(id, topic, level, link):
        mycursor = g.db.cursor()
        query = "UPDATE resource SET topic=%s, level=%s, link=%s WHERE resource_id=%s;"
        mycursor.execute(query, (topic,int(level),link,int(id),))
        g.db.commit()
    
    @staticmethod
    def deleteResource(id):
        mycursor = g.db.cursor()
        query = "DELETE FROM resource WHERE (`resource_id` = %s);"
        mycursor.execute(query,(int(id),))
        g.db.commit()