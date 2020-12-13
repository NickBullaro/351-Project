"""
models.py
Database models for SQLAlchemy
"""
from enum import Enum
import random
import json
import flask_sqlalchemy

DB = flask_sqlalchemy.SQLAlchemy()

class Messages(DB.Model):
    id = DB.Column(DB.Integer, primary_key=True)
    username = DB.Column(DB.String(120))
    message = DB.Column(DB.Text, nullable=False)
    sid = DB.Column(DB.String(120))
    picUrl = DB.Column(DB.Text)

    def __init__(self, user, message):
        self.sid = user["sid"]
        self.username = user["username"]
        self.picUrl = user['picUrl']
        self.message = message

    def __repr__(self):
        return {
            "name": self.username,
            "sid": self.sid,
            "picUrl": self.picUrl,
            "message": self.message
        }


class AuthUser(DB.Model):
    id = DB.Column(DB.Integer, primary_key=True)
    auth_type = DB.Column(DB.String(120))
    username = DB.Column(DB.String(120))
    email = DB.Column(DB.String(120))
    picUrl = DB.Column(DB.Text)
    
    def __init__(self, auth_type, name, email, pic=''):
        assert type(auth_type) is AuthUserType
        self.auth_type = auth_type.value
        self.username = name
        self.email = email
        self.picUrl = pic
        
class AuthUserType(Enum):
    GOOGLE = "google"
    
    @staticmethod
    def matchEnum(val):
        if (val == AuthUserType.GOOGLE.value):
            return AuthUserType.GOOGLE
        else:
            return None

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

