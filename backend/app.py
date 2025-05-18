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
import random

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

# set cors
CORS(app)
# Configure logging
logging.basicConfig(level=logging.INFO, format='%(levelname)s - %(message)s')
# Register the routes
home_routes(app)
api_routes(app)
# load env
load_dotenv()

# TODO: store data in a database
# Set up the MongoDB client
mongo_uri = os.environ.get('MONGO_URI')
client = MongoClient(mongo_uri)
try:
    mongo_uri = os.getenv('MONGO_URI')
    logging.info(f"MongoDB URI: {mongo_uri}")
    client = MongoClient(mongo_uri)
    db = client['claws']
    logging.info("MongoDB connection successful")
except Exception as e:
    logging.error(f"MongoDB connection failed: {e}")

@app.before_request
def before_request():
    g.db = db



"""
=================================================
                Global Variables
=================================================
"""
# Store connected HoloLens clients with unique IDs
next_hololens_id = 1
available_ids = set()  # Set of disconnected available IDs for future HoloLens
hololens_clients = {}  # client ID -> HoloLens unique ID

# Store PR client session ID
pr_client = None

# Room management
client_rooms = {}  # Dictionary to track rooms per client (e.g., {sid: {"room1", "room2"}, sid2: {"room1"}})



"""
=================================================
                WebSocket Events
=================================================
"""
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
    elif sid == pr_client:
        logging.info("PR client disconnected")
    else:
        logging.info(f"Client disconnected: {request.sid}")

    if sid in client_rooms:
        for room in client_rooms[sid]:
            leave_room(room)
            logging.info(f"Client {sid} removed from room {room}")
        del client_rooms[sid] # Remove the client from the room tracking dictionary



"""
=================================================
                Hololens Sockets
=================================================
"""
@socketio.on('connect_hololens')
def handle_hololens_connect():
    global next_hololens_id
    # Assign the next available ID to the HoloLens client (1 or 2 depending on connectivity)
    if available_ids:
        new_id_num = min(available_ids)
        available_ids.remove(new_id_num)
    else:
        new_id_num = next_hololens_id
        next_hololens_id += 1

    unique_id = f'hololens_{new_id_num}'
    hololens_clients[request.sid] = unique_id
    join_room(unique_id)

    # Send the unique ID back to the HoloLens client
    emit('assign_id', {'id': unique_id})
    logging.info(f"HoloLens Client {request.sid} connected with ID: {unique_id}")

# Send data to a specific HoloLens by unique ID
@socketio.on('send_to_hololens')
def handle_send_to_hololens(_data):
    if isinstance(_data, str):
        parsed_data = json.loads(_data)
    else:
        parsed_data = _data
    target_client = parsed_data['client'] # CLIENT ID
    # Send the parsed data to the target HoloLens
    emit('hololens_data', {'data': parsed_data}, room=target_client)
    logging.info(f"Sent message to hololens {target_client}: {parsed_data}")



"""
=================================================
                PR Client Sockets
=================================================
"""
@socketio.on('connect_pr')
def handle_pr_connect():
    global pr_client
    pr_client = request.sid
    join_room('pr_client')
    logging.info(f"PR Client connected with ID: {pr_client}")


@socketio.on('send_to_pr')
def handle_send_to_pr(_data):
    if isinstance(_data, str):
        parsed_data = json.loads(_data)
    else:
        parsed_data = _data

    emit('pr_data', {'data': parsed_data}, room='pr_client')
    logging.info(f"Sent message to PR client: {parsed_data}")



"""
=================================================
                Frontend Sockets
=================================================
"""
@socketio.on('send_to_room')
def handle_send_to_room(data):
    """
    Handles messages sent to a specific room and broadcasts them to all clients in that room.
    """
    if isinstance(data, str):
        parsed_data = json.loads(data)
    else:
        parsed_data = data

    room = parsed_data.get('room')
    message = parsed_data.get('message')

    # Broadcast the message to all clients in the specified room
    emit('room_data', {'room': room, 'message': message}, room=room)
    logging.info(f"Message broadcasted to room {room}: {message}")


import socket
import struct

# Server IP and Port
SERVER_IP = '10.0.0.4'  # replace with actual IP or '127.0.0.1' if local
SERVER_PORT = 14141          # as used in your server code

# Set up the UDP socket
sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
sock.settimeout(1.0)  # optional timeout

# Prepare the request buffer
# Format: [4 bytes: time][4 bytes: command][4 bytes: data (optional, can be 0s)]

# Send GET command 172 (e.g., for LIDAR)
time = 0               # You can set a dummy time or real one
command = 172          # This is your GET command
data = 0               # optional data

# Convert to big-endian bytes
request = struct.pack('>III', time, command, data)

# Send the request
sock.sendto(request, (SERVER_IP, SERVER_PORT))

try:
    # Receive the response
    response, addr = sock.recvfrom(4096)  # increase size if needed
    print(f"Received {len(response)} bytes from {addr}")

    # First 8 bytes: time (4) and command (4)
    recv_time, recv_command = struct.unpack('>II', response[:8])
    print(f"Time: {recv_time}, Command: {recv_command}")

    # Rest is data — depends on the type (e.g., float[], etc.)
    data_bytes = response[8:]

    # Example: parse as list of floats
    floats = struct.iter_unpack('>f', data_bytes)
    values = [f[0] for f in floats]
    print("Parsed float data:", values)

except socket.timeout:
    print("No response from server.")

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=8080,
                 debug=True, allow_unsafe_werkzeug=True)
