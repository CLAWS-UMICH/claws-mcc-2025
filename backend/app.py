from dotenv import load_dotenv
from routes.api import api_routes
from routes.home import home_routes
from flask import Flask, g, request

from flask_cors import CORS
from pymongo import MongoClient, errors
from flask_socketio import SocketIO, join_room, leave_room, emit
import os

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

# set cors
CORS(app)


# Import routes from separate files

# Register the routes
home_routes(app)
api_routes(app)


# load env
load_dotenv()

# Set up the MongoDB client
mongo_uri = os.environ.get('MONGO_URI')
client = MongoClient(mongo_uri)

try:
    # Set up the MongoDB client
    mongo_uri = os.getenv('MONGO_URI')
    print(mongo_uri)
    client = MongoClient(mongo_uri)
    db = client['claws']
    print("MongoDB connection successful")
except:
    print("MongoDB connection failed")

# Store db in the app context before each request
@app.before_request
def before_request():
    g.db = db

# WebSocket events
@socketio.on('connect')
def on_connect():
    print("Client connected:", request.sid)

@socketio.on('disconnect')
def on_disconnect():
    print("Client disconnected:", request.sid)

@socketio.on('join')
def on_join(data):
    client_type = data.get('type')  # "frontend" or "hololens"
    if client_type in ["frontend", "hololens"]:
        join_room(client_type)
        emit('joined', f'Joined {client_type} room', room=client_type)
        print(f"Client joined {client_type} room:", request.sid)
    else:
        emit('error', 'Invalid client type')

# Send messages to all users in frontend or hololens room
@socketio.on('broadcast_to_group')
def broadcast_to_group(data):
    target_group = data.get('group')  # "frontend" or "hololens"
    message = data.get('message')
    if target_group in ["frontend", "hololens"]:
        emit('message', message, room=target_group)
        print(f"Message sent to {target_group} group:", message)
    else:
        emit('error', 'Invalid group specified')

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=8080, debug=True, allow_unsafe_werkzeug=True)
