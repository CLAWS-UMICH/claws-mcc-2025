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
import uuid

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

# Store connected HoloLens clients with unique IDs
next_hololens_id = 0
available_ids = set() # set of disconnected available IDs for future hololens
hololens_clients = {} # client ID -> hololens unique ID

# Room management
active_rooms = set()  # Set to keep track of active room names

try:
    # Set up the MongoDB client
    mongo_uri = os.getenv('MONGO_URI')
    logging.info(f"MongoDB URI: {mongo_uri}")
    client = MongoClient(mongo_uri)
    db = client['claws']
    logging.info("MongoDB connection successful")
except Exception as e:
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
def handle_disconnect():
    sid = request.sid
    if sid in hololens_clients:
        # Extract the numeric part of the ID and add it back to available IDs
        unique_id_str = hololens_clients.pop(sid)
        unique_id_num = int(unique_id_str.replace('hololens_', ''))
        available_ids.add(unique_id_num)
        logging.info(f"HoloLens disconnected with ID: {unique_id_str}")
    else:
        logging.info(f"Client disconnected: {request.sid}")

    # TODO: Update logic on active rooms if they disconnect

"""
=================================================
                Hololens Sockets
=================================================
"""

@socketio.on('connect_hololens')
def handle_hololens_connect():
    global next_hololens_id

    # Assign the lowest available ID or the next sequential ID
    if available_ids:
        new_id_num = min(available_ids)
        available_ids.remove(new_id_num)
    else:
        new_id_num = next_hololens_id
        next_hololens_id += 1

    unique_id = f'hololens_{new_id_num}'
    
    # Map the connection to the unique ID and join the room
    hololens_clients[request.sid] = unique_id
    join_room(unique_id)

    # Send the unique ID back to the HoloLens client
    emit('assign_id', {'id': unique_id})
    logging.info(f"HoloLens connected with ID: {unique_id}")

# Send data to a specific HoloLens by unique ID
@socketio.on('send_to_hololens')
def handle_send_to_hololens(_data):
    target_id = _data['id']  # ID of the HoloLens to target
    data = _data['data']  # Data to send to the HoloLens
    emit('hololens_data', {'data': data}, room=target_id)
    logging.info(f"Sent message to hololens {target_id}: {data}")

"""
=================================================
                Frontend Sockets
=================================================
"""

# Join a specific room
@socketio.on('join_room')
def handle_join_room(_data):
    room = _data['room']  # Room name to join
    join_room(room)
    active_rooms.add(room)
    logging.info(f"Client {request.sid} joined room: {room}")
    emit('room_message', {'message': f"You have joined room: {room}"}, room=room)

# Leave a specific room
@socketio.on('leave_room')
def handle_leave_room(_data):
    room = _data['room']  # Room name to leave
    leave_room(room)
    logging.info(f"Client {request.sid} left room: {room}")
    emit('room_message', {'message': f"You have left room: {room}"}, room=room)

    # If the room is empty and remove it
    # if socketio.server.rooms.get(room): # TODO: Fix this logic of leaving rooms
    #     active_rooms.discard(room)
    #     logging.info(f"Room {room} is now empty and removed from active rooms")

# Send data to a specific room
@socketio.on('send_to_room')
def handle_send_to_room(_data):
    room = _data['room']  # Room name to send the message to
    data = _data['message']  # Message to send
    logging.info(f"Sent message to room {room}: {data}")
    emit('room_data', {'data': data}, room=room)

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=8080, debug=True, allow_unsafe_werkzeug=True)
