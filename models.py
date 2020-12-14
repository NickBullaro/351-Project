from enum import Enum
import json
import flask_sqlalchemy

DB = flask_sqlalchemy.SQLAlchemy()

class CreateAccount(DB.Model):
    id = DB.Column(DB.Integer, primary_key=True)
    sid = DB.Column(DB.String(32), nullable=False, unique=True)
    username = DB.Column(DB.String(120), nullable=True, unique=True)
    email = DB.Column(DB.String(120), unique=True)
    password = DB.Column(DB.String(120))
    
    def __init__(self, sid, username, email, password):
        self.sid = sid
        self.username = username
        self.email = email
        self.password = password

class CurrentConnections(DB.Model):
    id = DB.Column(DB.Integer, primary_key=True)
    sid = DB.Column(DB.String(32), nullable=False)
    username = DB.Column(DB.String(120), nullable=True)
    email = DB.Column(DB.String(120))

    def __init__(self, sid, username, email):
        self.sid = sid
        self.username = username
        self.email = email

