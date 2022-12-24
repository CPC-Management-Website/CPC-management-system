from . import db
from flask_login import UserMixin
from werkzeug.security import check_password_hash, generate_password_hash

class User(UserMixin):
    id = None
    vjudge_handle = None
    name = None
    email = None
    level = None
    role = None
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
        self.role = record["user_role"]
        self.active = record["active"]
        self.points = record["points"]
        self.password = record["password"]

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
        query  = "INSERT INTO user \
                (`vjudge_handle`, `name`,\
                `email`, `level`, `user_role`, \
                `active`, `points`, `password`)\
                VALUES (%s,%s,%s,%s,%s,%s,%s,%s);"
        mycursor.execute(query,(vjudge_handle,name,email,level,role,active,points,password,))
        db.commit()



    @staticmethod
    def changePasswordAdmin(email,newPassword):       
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
    
    
class permissions():
    read_weekly_status = False
    read_task =  False
    create_task = False
    update_task = False
    read_resource = False
    create_resource = False
    read_trainees = False
    create_trainees = False
    update_trainees = False
    delete_trainees = False
    read_transcript = False
    
    def __init__(self,user:User):
        def getRoleID(role):
            mycursor = db.cursor()
            stmt = "SELECT role_id from role where user_role = %s;"
            mycursor.execute(stmt,(role,))
            ID =  mycursor.fetchone()[0]
            return ID

        ID = getRoleID(user.role)
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
