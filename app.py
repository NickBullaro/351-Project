"""
app.py
Main module for the app
"""
import os
import io
from dotenv import load_dotenv
import flask
import flask_socketio
import models
import ssl
import hashlib

DOTENV_PATH = os.path.join(os.path.dirname(__file__), "keys.env")
load_dotenv(DOTENV_PATH)
cer = os.path.join(os.path.dirname(__file__), 'cert.pem')
key =os.path.join(os.path.dirname(__file__), 'key.pem')

username_taken = False
email_used = False
users = {}

try:
    DATABASE_URI = os.environ["DATABASE_URL"]
except KeyError:
    DATABASE_URI = ""

APP = flask.Flask(__name__)
socketio = flask_socketio.SocketIO(APP)
socketio.init_app(APP, cors_allowed_origins="*")
APP.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URI
APP.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
APP.config['SECRET_KEY'] = 'vnfjyhtdj5445#$'

models.DB.init_app(APP)
models.DB.app = APP

def database_init():
    models.DB.create_all()
    models.DB.session.commit()


def checkLogin(email, password):
    print("test login")
    check = models.DB.session.query(models.CreateAccount).filter_by(email=email).first()
    if(check):
        if(check.password == password):
            return 'Login accepted'
        else:
            return 'Invalid email or password!'
    else:
        return 'No account exists with that email!'

def emit_all_users():
    current_connections_rows = models.DB.session.query(models.CurrentConnections).all()
    all_users = []
    all_user_ids = []
    for current_connections_row in current_connections_rows:
        all_users.append(current_connections_row.username)
        all_user_ids.append(current_connections_row.id)
    print("users: ", all_users)
    socketio.emit('users received', {"all_users": users, 'all_ids': all_user_ids})

def clear_non_persistent_tables():
    models.DB.session.query(models.CurrentConnections).delete()
    models.DB.session.commit()


@socketio.on("connect")
def on_connect():
    print("Someone connected!")

@socketio.on("disconnect")
def on_disconnect():
    disconnected_user = (
        models.DB.session.query(models.CurrentConnections)
        .filter_by(sid=flask.request.sid)
        .first()
    )
    models.DB.session.delete(disconnected_user)
    models.DB.session.commit()
    del users[disconnected_user.username]
    emit_all_users()
    
@socketio.on("new login attempt")
def on_new_login(data):
    print("login attempt")
    h = hashlib.md5(data['password'].encode())
    result = checkLogin(data['email'], h.hexdigest())
    if(result == 'Login accepted'):
        username = models.DB.session.query(models.CreateAccount).filter_by(email=data['email']).first().username
        models.DB.session.add(models.CurrentConnections(flask.request.sid, username, data['email']))
        models.DB.session.commit()
        users[username] = flask.request.sid
        socketio.emit("login accepted", {
            'sid': flask.request.sid,
            'username': username,
            'email': data['email'],
            'users': users
        })
    elif(result == 'Invalid email or password!'):
        socketio.emit('bad login', {
            'message': 'Invalid email or password!'
        })
    elif(result == 'No account exists with that email!'):
        socketio.emit('bad login', {
            'message': 'No account exists with that email!'
        })
    emit_all_users()

@socketio.on("new account creation")
def on_new_user(data):
    try:
        h = hashlib.md5(data['password'].encode())
        models.DB.session.add(models.CreateAccount(flask.request.sid, data['username'], data['email'], h.hexdigest()))
        models.DB.session.commit()
        users[data['username']] = flask.request.sid
        socketio.emit("login accepted", {
            'sid': flask.request.sid,
            'username': data['username'],
            'email': data['email'],
            'users': users
        })
    except Exception as error:
        for errors in error.args:
            if('create_account_username_key') in errors:
                socketio.emit('bad creation', {
                    'message': 'Username already taken!'
                })
            if 'create_account_email_key' in errors:
                socketio.emit('bad creation', {
                    'message': 'An account already exists with that email!'
                })
    emit_all_users()

@socketio.on("new message input")
def on_new_message(data):
    print("Got an event for new message input")
    socketio.emit(data['target'], data)


@APP.route("/")
def index():
    return flask.render_template("index.html")

if __name__ == "__main__":
    database_init()
    clear_non_persistent_tables()
    socketio.run(
        APP,
        host=os.getenv("IP", "0.0.0.0"),
        port=int(os.getenv("PORT", "8080")),
        debug=True,
    )