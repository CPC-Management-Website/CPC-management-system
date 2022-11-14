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
    permissions = None
    
    def get_id(self):
        return self.id

    def __init__(self, email):
        mycursor = db.cursor()
        query = "SELECT * FROM user where email=\""+email+"\""
        mycursor.execute(query)
    def __init__(self, email,vjudge_handle,password,user_role):
        self.email = email
        self.password = password
        self.vjudge_handle = vjudge_handle
        self.role = user_role
    
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
        query  = "INSERT INTO training.user (`email`, `vjudge_handle`,`user_role`,`password`) VALUES ('" +email+"','"+vjudge_handle+"','trainee','"+password+"');"
        mycursor.execute(query)
        db.commit()
        print("here")
        
    @staticmethod
    def getUser(email):
        mycursor = db.cursor()
        query  = "SELECT `email` ,`vjudge_handle`, `password`, `user_role` from user where email = \""+email+"\""
        mycursor.execute(query)
        user = None
        for x in mycursor:
            user = User(x[0],x[1],x[2],x[3])
        return user
    
    @staticmethod
    def getPermissions(user):
        def getRoleID(role):
            #TODO sql query to get role id from role name
            return 1
        ID = getRoleID(User.role)
        #TODO write sql for getting role permissions
        return permissions()
    
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
    
    @staticmethod
    def getRoleID(role):
        mycursor = db.cursor()
        stmt = "SELECT role_id from role where user_role = %s;"
        mycursor.execute(stmt,(role,))
        ID =  mycursor.fetchone()[0]
        return ID

    def __init__(self,user:User):
        ID = permissions.getRoleID(user.role)
        mycursor = db.cursor()
        stmt = "SELECT * from permission where role_id = %s;"
        mycursor.execute(stmt,(ID,))
        temp = dict(zip(mycursor.column_names, mycursor.fetchone()))
        for key in temp:
            setattr(self,key,temp[key])
