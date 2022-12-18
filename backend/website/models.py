from . import db
from flask_login import UserMixin

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
        if mycursor.rowcount ==-1:
            return False
        return True
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
