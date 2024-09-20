import datetime
import hashlib
import os
import secrets
from datetime import datetime, timedelta

import mysql.connector
from dotenv import load_dotenv
from flask import g
from werkzeug.security import check_password_hash, generate_password_hash

from app import errors

from .APIs.email_api import send_password_reset_email
from .APIs.vjudge_api import get_progress_bulk
from .db import get_connection

load_dotenv()

current_season_id = os.getenv("CURRENT_SEASON_ID")
print(f"Current season ID: {current_season_id}")

PASSWORD_LENGTH = 10
TOKEN_LENGTH = 16
DATE_FORMAT = "%Y-%m-%d %H:%M:%S"


class User:
    id = None
    vjudge_handle = None
    name = None
    email = None
    role_id = None
    points = None
    password = None

    def __init__(self, email):
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        query = """
            SELECT user_id, vjudge_handle, name, email, points, password
            FROM user
            WHERE email = %s;
        """
        cursor.execute(query, (email,))
        record = cursor.fetchone()
        self.id = record["user_id"]
        self.vjudge_handle = record["vjudge_handle"]
        self.name = record["name"]
        self.email = record["email"]
        self.role_id = User.get_user_role(user_id=self.id)
        self.points = record["points"]
        self.password = record["password"]

    @staticmethod
    def get_user_id(email):
        conn = get_connection()
        cursor = conn.cursor()
        query = "SELECT user_id FROM user WHERE email = %s;"
        cursor.execute(query, (email,))
        user_id = cursor.fetchone()[0]
        return user_id

    @staticmethod
    def get_user_email(user_id):
        conn = get_connection()
        cursor = conn.cursor()
        query = "SELECT email FROM user WHERE user_id = %s;"
        cursor.execute(query, (user_id,))
        email = cursor.fetchone()[0]
        return email

    @staticmethod
    def get_user_email_by_vjudge_handle(vjudge_handle):
        conn = get_connection()
        cursor = conn.cursor()
        query = "SELECT email FROM user WHERE vjudge_handle = %s;"
        cursor.execute(query, (vjudge_handle,))
        email = cursor.fetchone()
        if email is not None:
            return email[0]
        return None

    @staticmethod
    def get_vjudge_handle(user_id):
        conn = get_connection()
        cursor = conn.cursor()
        query = "SELECT vjudge_handle FROM user WHERE user_id = %s;"
        cursor.execute(query, (user_id,))
        vjudge_handle = cursor.fetchone()[0]
        return vjudge_handle

    @staticmethod
    def check_password(user_id, password):
        conn = get_connection()
        cursor = conn.cursor()
        query = "SELECT password FROM user WHERE user_id = %s;"
        cursor.execute(query, (user_id,))
        true_password = cursor.fetchone()[0]
        return check_password_hash(true_password, password)

    @staticmethod
    def email_exists(email):
        conn = get_connection()
        cursor = conn.cursor()
        query = "SELECT * FROM user WHERE email = %s;"
        cursor.execute(query, (email,))
        cursor.fetchall()
        if cursor.rowcount >= 1:
            return True
        return False
        # return bool(cursor.rowcount)

    @staticmethod
    def vjudge_handle_exists(vjudge_handle):
        conn = get_connection()
        cursor = conn.cursor()
        query = "SELECT * FROM user WHERE BINARY vjudge_handle = %s;"
        cursor.execute(query, (vjudge_handle,))
        cursor.fetchall()
        if cursor.rowcount >= 1:
            return True
        return False
        # return bool(cursor.rowcount)

    @staticmethod
    def id_exists(user_id):
        conn = get_connection()
        cursor = conn.cursor()
        query = "SELECT * FROM user where user_id = %s;"
        cursor.execute(query, (user_id,))
        cursor.fetchone()
        if cursor.rowcount == 1:
            return True
        return False
        # return bool(cursor.rowcount)

    @staticmethod
    def check_availability(user_id, email, vjudge_handle):
        old_email = User.get_user_email(user_id=user_id)
        if old_email != email and User.email_exists(email=email):
            return errors.email_already_registered()

        old_vjudge_handle = User.get_vjudge_handle(user_id=user_id)
        if old_vjudge_handle != vjudge_handle and User.vjudge_handle_exists(
            vjudge_handle=vjudge_handle
        ):
            return errors.vjudge_already_registered()

    # deprecated
    @staticmethod
    def add_user_admin(vjudge_handle, name, email, points, password, discord):
        conn = get_connection()
        cursor = conn.cursor()
        # roleID = Permissions.getRoleID(role)
        query = """
            INSERT INTO user
            (vjudge_handle, `name`, email, points, `password`, discord_handle)
            VALUES (%s, %s, %s, %s, %s, %s);
        """
        cursor.execute(query, (vjudge_handle, name, email, points, password, discord))
        g.db.commit()

    @staticmethod
    def register_user_by_admin(
        name,
        email,
        vjudge_handle,
        discord,
        password,
        role_id,
        level_id,
        phone=None,
        university=None,
        faculty=None,
        university_level=None,
        major=None,
    ):
        User.add_user(
            name,
            email,
            vjudge_handle,
            phone,
            university,
            faculty,
            university_level,
            major,
            discord,
            password,
        )
        user_id = User.get_user_id(email=email)
        print("Registering", email, "in contests")
        Enrollment.enroll(user_id=user_id, level_id=level_id, role_id=role_id)
        ProgressPerContest.init_contest_progress_contestant(user_id)

    @staticmethod
    def add_user(
        name,
        email,
        vjudge,
        phone,
        university,
        faculty,
        university_level,
        major,
        discord,
        password,
    ):
        conn = get_connection()
        cursor = conn.cursor()
        # roleID = Permissions.getRoleID("Trainee")
        query = """
            INSERT INTO user
            (`name`, email, vjudge_handle, phone_number, university, faculty,
             university_level, major, discord_handle, `password`)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
        """
        cursor.execute(
            query,
            (
                name,
                email,
                vjudge,
                phone,
                university,
                faculty,
                university_level,
                major,
                discord,
                password,
            ),
        )
        g.db.commit()

    @staticmethod
    def register_user(
        name,
        email,
        vjudge,
        phone,
        university,
        faculty,
        university_level,
        major,
        discord,
        password,
    ):
        User.add_user(
            name,
            email,
            vjudge,
            phone,
            university,
            faculty,
            university_level,
            major,
            discord,
            password,
        )
        user_id = User.get_user_id(email=email)
        print("Registering", email, "in contests")
        ProgressPerContest.init_contest_progress_contestant(user_id)

    @staticmethod
    def assign_mentor(trainee_email, mentor_email, season_id=current_season_id):
        trainee_id = User.get_user_id(trainee_email)
        mentor_id = User.get_user_id(mentor_email)
        conn = get_connection()
        cursor = conn.cursor()
        query = """
            UPDATE enrollment
            SET mentor_id = %s
            WHERE user_id = %s
              AND season_id = %s;
        """
        cursor.execute(query, (mentor_id, trainee_id, season_id))
        g.db.commit()

    @staticmethod
    def get_user_role(user_id):
        conn = get_connection()
        cursor = conn.cursor()
        query = "SELECT IFNULL(MIN(role_id), 3) FROM enrollment WHERE user_id = %s"
        # This query gets the most privileged role
        # (roles are sorted from most privileged to least privileged)
        # and if a user for some reason is not enrolled in any season it assumes that
        # the role is trainee (role_id = 3)
        cursor.execute(query, (user_id,))
        role_id = cursor.fetchone()[0]
        return role_id

    @staticmethod
    def get_user_role_id(user_id, season=current_season_id):
        conn = get_connection()
        cursor = conn.cursor()
        query = "SELECT role_id FROM enrollment WHERE user_id = %s AND season_id = %s;"
        cursor.execute(query, (user_id, season))
        role_name = cursor.fetchone()[0]
        return role_name

    @staticmethod
    def get_role_name(role_id):
        conn = get_connection()
        cursor = conn.cursor()
        query = "SELECT user_role FROM role WHERE role_id = %s;"
        cursor.execute(query, (role_id,))
        role_name = cursor.fetchone()[0]
        return role_name

    @staticmethod
    def get_user_role_name(email):
        user = User(email=email)
        role_id = User.get_user_role_id(user.id)
        return User.get_role_name(role_id)

    @staticmethod
    def update_password(user_id, new_password):
        # TODO invalidate session when session authentication is implemented
        def is_same_password(user_id, new_password):
            conn = get_connection()
            cursor = conn.cursor()
            query = "SELECT password FROM user where user_id = %s;"
            cursor.execute(query, (user_id,))
            record = cursor.fetchone()
            # print(record)
            # print(newPassword)
            if check_password_hash(record["password"], new_password):
                return True
            else:
                return False

        if User.id_exists(user_id):
            conn = get_connection()
            cursor = conn.cursor()
            new_password = generate_password_hash(new_password, method="scrypt")
            query = "UPDATE user SET password = %s WHERE (user_id = %s);"
            cursor.execute(query, (new_password, user_id))
            # if(cursor.rowcount)
            g.db.commit()
            if cursor.rowcount != 0:
                print("Password for", user_id, "updated successfully")
            else:
                print("Error Updating Password")
                # print(cursor.rowcount)
        else:
            print("Email doesn't exist")

    @staticmethod
    def generate_password_reset_token(user_id):
        while True:
            token = secrets.token_urlsafe(TOKEN_LENGTH)
            hashed_token = hashlib.sha256(token.encode("utf-8")).hexdigest()
            expiry_time = datetime.now() + timedelta(minutes=10)
            try:
                conn = get_connection()
                cursor = conn.cursor()
                query = """
                    INSERT INTO password_reset_tokens
                    VALUES (%s, %s, %s)
                    ON DUPLICATE KEY
                        UPDATE token = %s,
                               expires_at = %s
                """
                cursor.execute(
                    query,
                    (user_id, hashed_token, expiry_time, hashed_token, expiry_time),
                )
                g.db.commit()
                break
            except mysql.connector.IntegrityError:
                print("Duplicate reset token, trying again")
        return token

    @staticmethod
    def check_password_reset_token(token) -> bool:
        hashed_token = hashlib.sha256(token.encode("utf-8")).hexdigest()
        conn = get_connection()
        cursor = conn.cursor()
        query = "SELECT expires_at FROM password_reset_tokens WHERE token = %s"
        cursor.execute(query, (hashed_token,))
        result = cursor.fetchone()

        if result is None:
            return False

        date = result[0]

        if date < datetime.now():
            return False

        return True

    @staticmethod
    def delete_password_reset_token(user_id):
        conn = get_connection()
        cursor = conn.cursor()
        query = "DELETE FROM password_reset_tokens WHERE (`user_id` = %s);"
        cursor.execute(query, (user_id,))
        g.db.commit()

    @staticmethod
    def cleanup_expired_password_reset_tokens():
        conn = get_connection()
        cursor = conn.cursor()
        query = "DELETE FROM password_reset_tokens WHERE (`expires_at` < %s);"
        cursor.execute(query, (datetime.now(),))
        g.db.commit()

    @staticmethod
    def reset_password_with_token(token, new_password):
        if not User.check_password_reset_token(token):
            return False
        hashed_token = hashlib.sha256(token.encode("utf-8")).hexdigest()
        conn = get_connection()
        cursor = conn.cursor()
        query = "SELECT user_id FROM password_reset_tokens WHERE token = %s"
        cursor.execute(query, (hashed_token,))
        user_id = cursor.fetchone()[0]
        User.update_password(user_id, new_password)
        User.delete_password_reset_token(user_id)
        return True

    @staticmethod
    def get_vjudge_handles():
        conn = get_connection()
        cursor = conn.cursor()
        query = "SELECT user_id, vjudge_handle from user;"
        cursor.execute(query)
        columns = cursor.column_names
        result = []
        for x in cursor:
            result.append(dict(zip(columns, x)))
        # print (result)
        return result

    @staticmethod
    def get_ids_by_vjudge_handles():
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        query = "SELECT user_id, vjudge_handle from user;"
        cursor.execute(query)
        result = cursor.fetchall()
        user_ids = dict()
        for entry in result:
            user_ids[entry["vjudge_handle"]] = entry["user_id"]
        return user_ids

    @staticmethod
    def get_all_users(role, season_id=current_season_id):
        role_id = Permissions.get_role_id(role)
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        query = """
            SELECT distinct u.user_id,
                            u.vjudge_handle,
                            u.name,
                            u.email,
                            e.mentor_id     as mentor_id,
                            m.name          as mentor_name,
                            l.name          as level_name,
                            e.enrollment_id as enrollment_id,
                            e.level_id      as level_id,
                            e.season_id     as season_id,
                            e.enrolled      as enrolled
            from (user u)
                     inner join enrollment e
                                on (u.user_id = e.user_id AND e.season_id = %s)
                     left join user m on (e.mentor_id = m.user_id)
                     left join training_levels l on (e.level_id = l.level_id)
            WHERE (e.role_id = %s)
            ORDER BY enrolled DESC, level_id;
        """
        cursor.execute(query, (season_id, role_id))
        records = cursor.fetchall()
        users = []
        for record in records:
            users.append(record)
        return users

    @staticmethod
    def get_mentees(mentor_id, season_id=current_season_id):
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        query = """
            SELECT distinct u.user_id,
                            u.vjudge_handle,
                            u.name,
                            u.email,
                            e.mentor_id     as mentor_id,
                            m.name          as mentor_name,
                            l.name          as level_name,
                            e.enrollment_id as enrollment_id,
                            e.level_id      as level_id,
                            e.season_id     as season_id,
                            e.enrolled      as enrolled
            from (user u)
                     inner join enrollment e 
                                on (u.user_id = e.user_id AND e.season_id = %s)
                     left join user m on (e.mentor_id = m.user_id)
                     left join training_levels l on (e.level_id = l.level_id)
            WHERE (e.mentor_id = %s);
        """
        cursor.execute(query, (season_id, mentor_id))
        records = cursor.fetchall()
        users = []
        for record in records:
            users.append(record)
        return users

    @staticmethod
    def reset_password(user_id):
        password = secrets.token_urlsafe(PASSWORD_LENGTH)
        User.update_password(user_id=user_id, new_password=password)
        email = User.get_user_email(user_id=user_id)
        send_password_reset_email(email, password)

    @staticmethod
    def update_data(user_id, email, name, vjudge_handle):
        # User.updatePassword(user_id = id, newPassword = password)
        conn = get_connection()
        cursor = conn.cursor()
        query = """
            UPDATE user
            SET email = %s,
                vjudge_handle = %s,
                name = %s
            WHERE user_id = %s;
        """
        cursor.execute(query, (email, vjudge_handle, name, user_id))
        g.db.commit()

    @staticmethod
    def update_data_by_admin(user_id, name, vjudge_handle, email):
        conn = get_connection()
        cursor = conn.cursor()
        query = """
            UPDATE user
            SET name = %s,
                vjudge_handle = %s,
                email = %s
            WHERE user_id = %s;
        """
        cursor.execute(query, (name, vjudge_handle, email, user_id))
        g.db.commit()

    @staticmethod
    def update_data_by_admin_from_file(
        name,
        email,
        vjudge_handle,
        phone,
        university,
        faculty,
        university_level,
        major,
        discord,
    ):
        conn = get_connection()
        cursor = conn.cursor()
        query = """
            UPDATE user
            SET name = %s,
                vjudge_handle = %s,
                phone_number = %s,
                university = %s,
                faculty = %s,
                university_level = %s,
                major = %s,
                discord_handle = %s
            WHERE email = %s;
        """
        cursor.execute(
            query,
            (
                name,
                vjudge_handle,
                phone,
                university,
                faculty,
                university_level,
                major,
                discord,
                email,
            ),
        )
        g.db.commit()

    @staticmethod
    def delete_user(user_id):
        conn = get_connection()
        cursor = conn.cursor()
        query = "DELETE FROM user WHERE (user_id = %s);"
        cursor.execute(query, (user_id,))
        g.db.commit()

    @staticmethod
    def get_mentor_info(user_id, season_id):
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        query = """
            SELECT m.name,
                   m.email,
                   m.vjudge_handle,
                   m.phone_number,
                   m.discord_handle
            from (user u)
                     inner join enrollment e on (e.user_id = u.user_id)
                     inner join user m on (e.mentor_id = m.user_id)
            where u.user_id = %s
              AND e.season_id = %s;
        """
        cursor.execute(query, (user_id, season_id))
        mentor_info = cursor.fetchone()
        if mentor_info is not None:
            return mentor_info
        return None


class Permissions:

    def __init__(self, user: User):
        role_id = user.role_id
        conn = get_connection()
        cursor = conn.cursor()
        query = "SELECT * from permission where role_id = %s;"
        cursor.execute(query, (role_id,))
        temp = dict(zip(cursor.column_names, cursor.fetchone()))
        for key in temp:
            setattr(self, key, temp[key])

    def get_allowed_permissions(self):
        allowed_permissions = []
        for attribute, value in self.__dict__.items():
            if value:
                allowed_permissions.append(attribute)
        return allowed_permissions

    @staticmethod
    def get_role_id(role):
        conn = get_connection()
        cursor = conn.cursor()
        stmt = "SELECT role_id from role where user_role = %s;"
        cursor.execute(stmt, (role,))
        role_id = cursor.fetchone()[0]
        return role_id

    @staticmethod
    def get_all_roles():
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        query = "SELECT role_id, user_role from role;"
        cursor.execute(query)
        records = cursor.fetchall()
        roles = []
        for record in records:
            roles.append(record)
        return roles


class ProgressPerContest:
    # user_id = 0
    # contest_id = 0
    # solved_problems = 0
    # rank = 0
    # zone = "red"
    @staticmethod
    def get_contest_parameters(contest_id):
        # g.db.reconnect()
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        query = """
            SELECT total_problems, yellow_threshold, green_threshold
            FROM contest
            WHERE contest_id = %s;
        """
        cursor.execute(query, (contest_id,))
        record = cursor.fetchone()
        return (
            record["total_problems"],
            record["yellow_threshold"],
            record["green_threshold"],
        )

    @staticmethod
    def get_contest_parameters_by_season(season_id):
        # g.db.reconnect()
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        query = """
            SELECT contest_id, total_problems, yellow_threshold, green_threshold
            from contest
            where season_id = %s;
        """
        cursor.execute(query, (season_id,))
        records = cursor.fetchall()
        contest_parameters = dict()
        for record in records:
            params = {
                "total_problems": record["total_problems"],
                "yellow_threshold": record["yellow_threshold"],
                "green_threshold": record["green_threshold"],
            }
            contest_parameters[record["contest_id"]] = params
        return contest_parameters

    @staticmethod
    def get_zone(problem_count, num_solved, yellow_threshold, green_threshold):
        if num_solved == problem_count:
            return "Dark Green"
        if num_solved >= green_threshold:
            return "Green"
        if num_solved >= yellow_threshold:
            return "Yellow"
        return "Red"

    @staticmethod
    def add_progress_per_contest(user_id, contest_id, solved_problems, zone):

        conn = get_connection()
        cursor = conn.cursor()
        query = """
            INSERT INTO progress_per_contest (user_id, contest_id, solved_problems, 
                                              ranking, zone)
            VALUES (%s, %s, %s, %s, %s);
        """
        cursor.execute(query, (user_id, int(contest_id), solved_problems, 0, zone))
        g.db.commit()

    @staticmethod
    def update_progress_per_contest_bulk(progress_list):
        conn = get_connection()
        cursor = conn.cursor()
        query = """
            UPDATE progress_per_contest
            SET solved_problems = %s,
                ranking = %s,
                zone = %s
            WHERE user_id = %s
              AND contest_id = %s;
        """

        cursor.executemany(query, progress_list)
        g.db.commit()

    @staticmethod
    def register_bulk(to_be_registered_list):
        conn = get_connection()
        cursor = conn.cursor()
        query = """
            INSERT INTO progress_per_contest (user_id, contest_id, solved_problems, 
                                              ranking, zone)
            VALUES (%s, %s, %s, %s, %s);
        """
        cursor.executemany(query, to_be_registered_list)
        g.db.commit()

    def __init__(self) -> None:
        print("in init")

    @staticmethod
    def get_all_contests():
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        query = "SELECT * from contest;"
        cursor.execute(query)
        contests = cursor.fetchall()
        return contests

    @staticmethod
    def get_contests_admin(season=current_season_id):
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        query = """
            SELECT c.*, l.name AS level
            FROM (contest c)
                     INNER JOIN training_levels l ON (l.level_id = c.level_id)
            WHERE season_id = %s
            ORDER BY level_id, week_number
        """
        cursor.execute(query, (season,))
        contests = cursor.fetchall()
        return contests

    @staticmethod
    def get_contests_filtered(level_id, season_id=current_season_id):
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        print("level")
        print(level_id)
        query = "SELECT * from contest WHERE (level_id = %s AND season_id = %s);"
        cursor.execute(query, (level_id, season_id))
        contests = cursor.fetchall()
        return contests

    @staticmethod
    def get_user_progress(user_id, season_id=current_season_id):
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        # query  = "SELECT `contest_id`, `solved_problems`, `rank`, `zone`\
        #      from progress_per_contest where user_id = %s;"
        query = """
            SELECT distinct p.contest_id,
                            p.solved_problems,
                            p.ranking,
                            p.zone,
                            c.level_id,
                            c.season_id,
                            c.topic,
                            c.total_problems,
                            c.week_number
            from (progress_per_contest p)
                     inner join contest c on (c.contest_id = p.contest_id)
                     inner join enrollment e
                                on (e.level_id = c.level_id and
                                    e.season_id = c.season_id and e.user_id = p.user_id)
            WHERE (p.user_id = %s AND c.season_id = %s);
        """
        cursor.execute(query, (user_id, season_id))
        records = cursor.fetchall()

        return {"progress": records}

    @staticmethod
    def contest_exists(contest_id):
        conn = get_connection()
        cursor = conn.cursor()
        query = "SELECT * FROM contest where contest_id = %s;"
        cursor.execute(query, (contest_id,))
        cursor.fetchone()
        if cursor.rowcount == 1:
            return True
        return False

    @staticmethod
    def add_contest(
        contest_id,
        num_problems,
        yellow_threshold,
        green_threshold,
        topic,
        week_number,
        level_id,
    ):
        if ProgressPerContest.contest_exists(contest_id):
            return "Contest already registered"
        conn = get_connection()
        cursor = conn.cursor()
        query = """
            INSERT INTO contest (`contest_id`, `total_problems`, `yellow_threshold`,
                                 `green_threshold`, `topic`, `week_number`,
                                 `minimum_problems`, `level_id`, `season_id`)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s);
        """
        cursor.execute(
            query,
            (
                contest_id,
                num_problems,
                yellow_threshold,
                green_threshold,
                topic,
                week_number,
                0,
                level_id,
                current_season_id,
            ),
        )
        g.db.commit()
        return "Success"

    @staticmethod
    def delete_contest(contest_id):
        conn = get_connection()
        cursor = conn.cursor()
        query = "DELETE FROM contest WHERE (`contest_id` = %s);"
        cursor.execute(query, (int(contest_id),))
        g.db.commit()

    @staticmethod
    def update_contest(
        new_contest_id,
        topic,
        yellow_threshold,
        green_threshold,
        total,
        week_number,
        level_id,
        old_contest_id,
    ):
        conn = get_connection()
        cursor = conn.cursor()
        query = """
            UPDATE contest
            SET contest_id = %s,
                topic = %s,
                yellow_threshold = %s,
                green_threshold = %s,
                total_problems = %s,
                week_number = %s,
                level_id = %s
            WHERE contest_id = %s;
        """
        cursor.execute(
            query,
            (
                new_contest_id,
                topic,
                yellow_threshold,
                green_threshold,
                total,
                week_number,
                level_id,
                old_contest_id,
            ),
        )
        g.db.commit()

    @staticmethod
    def init_contest_progress_contest(contest_id):
        trainees = User.get_vjudge_handles()
        to_be_registered_list = []
        for trainee in trainees:
            user_id = trainee["user_id"]
            vjudge = trainee["vjudge_handle"]
            print(user_id, vjudge)
            # the second zero here is a temporary number for user rank in contest
            to_be_registered_list.append((user_id, contest_id, 0, 0, "Red"))
        ProgressPerContest.register_bulk(to_be_registered_list=to_be_registered_list)
        return " "

    @staticmethod
    def init_contest_progress_contestant(contestant_id):
        contests = ProgressPerContest.get_all_contests()
        to_be_registered_list = []
        for contest in contests:
            contest_id = contest["contest_id"]
            # the second zero here is a temporary number for user rank in contest
            to_be_registered_list.append((contestant_id, contest_id, 0, 0, "Red"))
        ProgressPerContest.register_bulk(to_be_registered_list=to_be_registered_list)

    @staticmethod
    def update_progress_bulk(progress, contest_parameters):
        user_ids = User.get_ids_by_vjudge_handles()
        try:
            progress_list = []
            for contest_id in progress:
                print(f"Updating data for contest {contest_id}")
                problem_count = contest_parameters[contest_id]["total_problems"]
                yellow_threshold = contest_parameters[contest_id]["yellow_threshold"]
                green_threshold = contest_parameters[contest_id]["green_threshold"]
                for vjudge_handle in progress[contest_id]:
                    if vjudge_handle in user_ids.keys():
                        num_solved = progress[contest_id][vjudge_handle]
                        zone = ProgressPerContest.get_zone(
                            problem_count=problem_count,
                            num_solved=num_solved,
                            yellow_threshold=yellow_threshold,
                            green_threshold=green_threshold,
                        )
                        # the zero here is a temporary number for user rank in contest
                        progress_list.append(
                            (num_solved, 0, zone, user_ids[vjudge_handle], contest_id)
                        )
                        # ProgressPerContest.addProgressPerContest(user_ids,contest_id,num_solved,zone)
            ProgressPerContest.update_progress_per_contest_bulk(
                progress_list=progress_list
            )
            print("Successfully updated progress for all contests")
        except Exception as e:
            print(e)
            print("Couldn't update progress")
        return " "

    @staticmethod
    def update_all_progress():
        contest_parameters = ProgressPerContest.get_contest_parameters_by_season(
            season_id=current_season_id
        )
        progress = get_progress_bulk(contests=contest_parameters.keys())
        ProgressPerContest.update_progress_bulk(
            progress=progress, contest_parameters=contest_parameters
        )


class Resources:

    @staticmethod
    def add_resource(topic, link, level, season_id=current_season_id):
        conn = get_connection()
        cursor = conn.cursor()
        query = """
            INSERT INTO resource (`topic`, `link`, `level_id`, `season_id`)
            VALUES (%s, %s, %s, %s);
        """
        cursor.execute(query, (topic, link, int(level), season_id))
        g.db.commit()

    @staticmethod
    def get_all_resources(season_id=current_season_id):
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        query = """
            SELECT DISTINCT r.resource_id,
                            r.topic,
                            r.link,
                            r.season_id,
                            l.name AS level,
                            l.level_id
            FROM (resource r)
                     LEFT JOIN training_levels l ON (r.level_id = l.level_id)
            WHERE (season_id = %s)
            ORDER BY level_id, resource_id
        """
        cursor.execute(query, (season_id,))
        records = cursor.fetchall()
        resources = []
        for record in records:
            resources.append(record)
        return resources

    @staticmethod
    def get_resources(user_id, season_id=current_season_id):
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        query = """
            SELECT distinct r.resource_id,
                            r.topic,
                            r.link,
                            r.season_id,
                            r.level_id,
                            l.name as level
            from (resource r)
                     inner join enrollment e
                                on (e.season_id = r.season_id and
                                    e.level_id = r.level_id)
                     inner join training_levels l on (r.level_id = l.level_id)
            where (e.user_id = %s and e.season_id = %s)
        """
        cursor.execute(query, (user_id, season_id))
        records = cursor.fetchall()
        resources = []
        for record in records:
            resources.append(record)
        return resources

    @staticmethod
    def update_resource(resource_id, topic, level_id, link):
        conn = get_connection()
        cursor = conn.cursor()
        query = """
            UPDATE resource
            SET topic = %s,
                level_id = %s,
                link = %s
            WHERE resource_id = %s;
        """
        cursor.execute(query, (topic, int(level_id), link, int(resource_id)))
        g.db.commit()

    @staticmethod
    def delete_resource(resource_id):
        conn = get_connection()
        cursor = conn.cursor()
        query = "DELETE FROM resource WHERE (`resource_id` = %s);"
        cursor.execute(query, (int(resource_id),))
        g.db.commit()


class AvailableDays:
    @staticmethod
    def add_available_days(email, available_days):
        user_id = User.get_user_id(email=email)
        conn = get_connection()
        cursor = conn.cursor()
        query = """
            INSERT INTO available_days (`user_id`, `sat`, `sun`, `mon`, `tues`, `wed`,
                                        `thur`)
            VALUES (%s, %s, %s, %s, %s, %s, %s);
        """
        cursor.execute(
            query,
            (
                user_id,
                available_days["sat"],
                available_days["sun"],
                available_days["mon"],
                available_days["tues"],
                available_days["wed"],
                available_days["thur"],
            ),
        )
        g.db.commit()


class Levels:
    @staticmethod
    def get_all_levels():
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        query = "SELECT `level_id`, `name` FROM training_levels"
        cursor.execute(query)
        records = cursor.fetchall()
        levels = []
        for record in records:
            levels.append(record)
        return levels

    @staticmethod
    def get_visible_levels():
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        query = "SELECT `level_id`, `name` FROM training_levels WHERE visible = 1"
        cursor.execute(query)
        records = cursor.fetchall()
        levels = []
        for record in records:
            levels.append(record)
        return levels


class Seasons:
    @staticmethod
    def get_all_seasons():
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        query = "SELECT `season_id`, `name` FROM seasons ORDER BY season_id DESC "
        cursor.execute(query)
        records = cursor.fetchall()
        seasons = []
        for record in records:
            seasons.append(record)
        return seasons

    @staticmethod
    def get_enrolled_seasons(user_id):
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        query = """
            SELECT `season_id`, `name`
            FROM seasons
            WHERE season_id IN (SELECT `season_id` FROM enrollment WHERE user_id = %s);
        """
        cursor.execute(query, (user_id,))
        records = cursor.fetchall()
        seasons = []
        for record in records:
            seasons.append(record)
        return seasons


class Enrollment:
    @staticmethod
    def enroll(
        user_id, level_id, season_id=current_season_id, role_id=3
    ):  # by default enroll user as a trainee (role_id = 3)
        conn = get_connection()
        cursor = conn.cursor()
        query = """
            INSERT INTO enrollment (`user_id`, `level_id`, `season_id`, `role_id`)
            VALUES (%s, %s, %s, %s);
        """
        cursor.execute(query, (user_id, level_id, season_id, role_id))
        g.db.commit()

    @staticmethod
    def get_latest_enrollment_season(user_id):
        conn = get_connection()
        cursor = conn.cursor()
        query = "SELECT IFNULL(MAX(season_id), 0) FROM enrollment where user_id = %s"
        # This query gets the most privileged role
        # (roles are sorted from most privileged to least privileged)
        # and if a user for some reason is not enrolled in any season
        # it assumes the role is trainee (role_id = 3)
        cursor.execute(query, (user_id,))
        season_id = cursor.fetchone()[0]
        return season_id

    @staticmethod
    def get_enrollment(user_id, season_id=current_season_id):
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        query = """
            SELECT `enrollment_id`, `user_id`, `level_id`, `season_id`, `enrolled`
            FROM enrollment
            WHERE (user_id = %s AND season_id = %s)
        """
        cursor.execute(query, (user_id, season_id))
        enrollment = cursor.fetchone()
        # enrollment = []
        # for record in records:
        #     enrollment.append(record)
        return enrollment

    @staticmethod
    def update_enrollment(
        enrollment_id, level_id, mentor_id, enrolled, season_id=current_season_id
    ):
        conn = get_connection()
        cursor = conn.cursor()
        query = """
            UPDATE enrollment
            SET level_id = %s,
                season_id = %s,
                mentor_id = %s,
                enrolled = %s
            WHERE enrollment_id = %s;
        """
        cursor.execute(query, (level_id, season_id, mentor_id, enrolled, enrollment_id))
        g.db.commit()

    # TODO make merge these two functions
    @staticmethod
    def update_enrollment_from_file(
        enrollment_id,
        level_id,
        mentor_id,
        enrolled,
        role_id,
        season_id=current_season_id,
    ):
        conn = get_connection()
        cursor = conn.cursor()
        query = """
            UPDATE enrollment
            SET level_id = %s,
                season_id = %s,
                mentor_id = %s,
                enrolled = %s,
                role_id = %s
            WHERE enrollment_id = %s;
        """
        cursor.execute(
            query, (level_id, season_id, mentor_id, enrolled, role_id, enrollment_id)
        )
        g.db.commit()

    @staticmethod
    def enroll_from_registration(email):
        user_id = User.get_user_id(email=email)
        level_id = 1  # id for level 1
        Enrollment.enroll(user_id=user_id, level_id=level_id)

    @staticmethod
    def is_enrolled(user_id, season_id=current_season_id):
        conn = get_connection()
        cursor = conn.cursor()
        query = """
            SELECT enrollment_id
            FROM enrollment
            where user_id = %s
              and season_id = %s;
        """
        cursor.execute(query, (user_id, season_id))
        cursor.fetchone()
        if cursor.rowcount == 1:
            return True
        return False

    @staticmethod
    def get_enrollment_level(user_id, season_id=current_season_id):
        conn = get_connection()
        cursor = conn.cursor()
        query = "SELECT level_id FROM enrollment where user_id = %s and season_id = %s;"
        cursor.execute(query, (user_id, season_id))
        return cursor.fetchone()[0]


class Vars:
    @staticmethod
    def get_variable_value(variable_name):
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        query = "SELECT `value` from vars WHERE name = %s;"
        cursor.execute(query, (variable_name,))
        value = cursor.fetchone()
        return value

    @staticmethod
    def set_variable_value(variable_name, value):
        conn = get_connection()
        cursor = conn.cursor()
        query = "UPDATE vars SET value = %s WHERE name = %s;"
        cursor.execute(query, (value, variable_name))
        g.db.commit()
