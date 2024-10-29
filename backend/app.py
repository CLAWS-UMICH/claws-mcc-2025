from dotenv import load_dotenv
from routes.api import api_routes
from routes.home import home_routes
from flask import Flask, g, request

from flask_cors import CORS
from pymongo import MongoClient, errors
from flask_socketio import SocketIO, join_room, leave_room, emit
import os
import logging
import json

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

# set cors
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(levelname)s - %(message)s')


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
    logging.info(f"MongoDB URI: {mongo_uri}")
    client = MongoClient(mongo_uri)
    db = client['claws']
    logging.info("MongoDB connection successful")
except:
    logging.error(f"MongoDB connection failed: {e}")

# Store db in the app context before each request
@app.before_request
def before_request():
    g.db = db

# WebSocket events
@socketio.on('connect')
def on_connect():
    logging.info(f"Client connected: {request.sid}")

@socketio.on('disconnect')
def on_disconnect():
    logging.info(f"Client disconnected: {request.sid}")

@socketio.on('join')
def on_join(data):
    client_type = data.get('type')  # "frontend" or "hololens"
    if client_type in ["frontend", "hololens"]:
        join_room(client_type)
        emit('joined', f'Joined {client_type} room', room=client_type)
        logging.info(f"Client joined {client_type} room: {request.sid}")
    else:
        emit('error', 'Invalid client type')

# Send messages to all users in frontend or hololens room
@socketio.on('broadcast_to_group')
def broadcast_to_group(data):
    target_group = data.get('group')  # "frontend" or "hololens"
    message = data.get('message')
    if target_group in ["frontend", "hololens"]:
        emit('message', message, room=target_group)
        logging.info(f"Message sent to {target_group} group: {message}")
    else:
        emit('error', 'Invalid group specified')

@socketio.on('message')
def handle_message(data):
    logging.info(f"Message received: {data}")
    try:
        dic = json.loads(data)
        logging.info(f"Decoded message data: {dic}")
    except json.JSONDecodeError:
        logging.error("Invalid JSON received.")

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=8080, debug=True, allow_unsafe_werkzeug=True)
