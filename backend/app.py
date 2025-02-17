from dotenv import load_dotenv
from routes.api import api_routes
from routes.home import home_routes
from flask import Flask, g, request
from datetime import datetime

from flask_cors import CORS
from pymongo import MongoClient, errors
from flask_socketio import SocketIO, join_room, leave_room, emit
import os
import logging
import json
import uuid
import random

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
available_ids = set()  # set of disconnected available IDs for future hololens
hololens_clients = {}  # client ID -> hololens unique ID

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
    logging.info(f"HoloLens Client {request.sid} connected with ID: {unique_id}")

# Send data to a specific HoloLens by unique ID
@socketio.on('send_to_hololens')
def handle_send_to_hololens(_data):
    target_room = _data['room']  # ID of the HoloLens to target
    data = _data['data']  # Data to send to the HoloLens

    # Parse the JSON string to remove escape characters
    try:
        parsed_data = json.loads(data)  # Parse the data to get a proper JSON object
    except json.JSONDecodeError as e:
        logging.error(f"Failed to parse data for {target_room}: {e}")
        return

    # Send the parsed data to the target HoloLens
    emit('hololens_data', {'data': parsed_data}, room=target_room)
    logging.info(f"Sent message to hololens {target_room}: {parsed_data}")

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
    emit('room_message', {
         'message': f"You have joined room: {room}"}, room=room)

    if 'message' in _data:
        handle_send_to_room(_data)
    else:
        # If no message is provided, send a default message to the room
        default_message = f"Client {request.sid} has joined the room {room}."
        emit('room_data', {'data': default_message}, room=room)


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

def ran(range_from, range_to):
    return random.randint(range_from, range_to)

@socketio.on('send_message')
def handle_send_message(_data):
    """
    Expects a JSON payload of the form:
    {
       "room": "MESSAGING",
       "message_id": 0,
       "sent_to": 1,
       "message": "Hello world!",
       "from": 0
    }
    """
    room        = _data.get("room", "MESSAGING")
    message_id  = _data.get("message_id", 0)
    sent_to     = _data.get("sent_to", 0)
    message_txt = _data.get("message", "")
    from_id     = _data.get("from", 0)
    timestamp = datetime.now().astimezone()

    # Store the message in the DB
    msg_doc = {
       "message_id": message_id,
       "sent_to":    sent_to,
       "message":    message_txt,
       "from":       from_id,
       "timestamp": timestamp
    }
    try:
        g.db.messages.insert_one(msg_doc)
        logging.info(f"Inserted message into DB: {msg_doc}")
    except Exception as e:
        logging.error(f"Error inserting message: {e}")

    # Broadcast to everyone in "room" (for real apps, you might want to
    # broadcast only to the user with ID == `sent_to`, etc.)
    emit("new_message", msg_doc, room=room)
    logging.info(f"Sent new message to room {room}: {msg_doc}")

@socketio.on('get_messages')
def handle_get_messages(_data):
    room = _data.get("room", "MESSAGING")
    try:
        messages_cursor = g.db.messages.find(
            {"room": room},
            {"_id": 0}
        ).sort("timestamp", 1)

        messages = list(messages_cursor)

        # Send messages only to the requester
        emit("load_messages", {"messages": messages}, room=request.sid)
    except Exception as e:
        emit("error", {"message": "Could not retrieve messages"}, room=request.sid)


@socketio.on('send_to_room')
def handle_send_to_room(_data):
    room = _data['room']  # Room name to send the message to
    # data = _data['message']  # Message to send
    # add mock data here
    if room == "VITALS":
        mock_data = {
            "eva_time:": ran(0, 10000),
            "batt_time_left": ran(0, 100),
            "oxy_pri_storage": ran(0, 100),
            "oxy_sec_storage": ran(0, 100),
            "oxy_pri_pressure": ran(0, 2000),
            "oxy_sec_pressure": ran(0, 5000),
            "oxy_time_left": ran(0, 10000),
            "coolant_storage": ran(0, 100),
            "heart_rate": ran(0, 190),
            "oxy_consumption": ran(0, 190),
            "co2_production":ran(0, 120),
            "suit_pressure_oxy": 4.0,
            "suit_pressure_co2": 0.0,
            "suit_pressure_other": 0.0,
            "suit_pressure_total": 4.0,
            "helmet_pressure_co2": 0.1,
            "fan_pri_rpm": 30000,
            "fan_sec_rpm": 30000,
            "scrubber_a_co2_storage": 32,
            "scrubber_b_co2_storage": 0,
            "temperature": 70,
            "coolant_liquid_pressure": 400,
            "coolant_gas_pressure": 0,
            "alerts": {
                "AllAlerts": [
                # { "alert_id": 3, "vital": "heart_rate", "vital_val": 20 },
                # { "alert_id": 4, "vital": "oxy_consumption", "vital_val": 20 },
                # { "alert_id": 5, "vital": "co2_production", "vital_val": 20 },
                # { "alert_id": 6, "vital": "heart_rate", "vital_val": 20 },
                # { "alert_id": 7, "vital": "oxy_consumption", "vital_val": 20 },
                { "alert_id": 8, "vital": "oxy_time_left", "vital_val": 20 },
                { "alert_id": 9, "vital": "batt_time_left", "vital_val": 20 },
                { "alert_id": 10, "vital": "oxy_pri_storage", "vital_val": 20 },
                { "alert_id": 11, "vital": "oxy_sec_storage", "vital_val": 20 },
                { "alert_id": 12, "vital": "oxy_pri_pressure", "vital_val": 20 },
                { "alert_id": 13, "vital": "oxy_sec_pressure", "vital_val": 20 },
                { "alert_id": 14, "vital": "oxy_time_left", "vital_val": 20 },
                { "alert_id": 15, "vital": "coolant_storage", "vital_val": 20 }
                ]
            }
        }
        data = mock_data
    logging.info(f"Sent message to room {room}: {data}")
    emit('room_data', {'data': data}, room=room)


if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=8080,
                 debug=True, allow_unsafe_werkzeug=True)