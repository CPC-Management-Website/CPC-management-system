import os

from flask import Flask, g
from mysql.connector import MySQLConnection
from mysql.connector.pooling import MySQLConnectionPool, PooledMySQLConnection

connection_pool = None


def init_app(app: Flask):
    global connection_pool
    db_config = {
        "host": os.getenv("DB_HOST"),
        "user": os.getenv("DB_USER"),
        "password": os.getenv("DB_PASSWD"),
        "database": os.getenv("DB_DATABASE"),
    }
    connection_pool = MySQLConnectionPool(
        pool_name="my_pool", pool_size=6, autocommit=True, **db_config
    )
    app.teardown_appcontext(close_connection)


def get_connection() -> PooledMySQLConnection | MySQLConnection:
    global connection_pool
    if "db" not in g:
        g.db = connection_pool.get_connection()
    return g.db


def close_connection(e=None):
    db: PooledMySQLConnection = g.pop("db", None)
    if db is not None:
        db.close()
