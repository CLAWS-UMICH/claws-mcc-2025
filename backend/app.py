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
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='threading')

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

import threading
import time
import socket
import struct
from flask_socketio import emit, join_room, leave_room

# TSS Server configuration
TSS_SERVER_IP = '10.0.0.4'  # Your TSS server IP
TSS_SERVER_PORT = 14141     # Your TSS server port
TSS_ROOM = 'tss_room'       # Name of the TSS room
TSS_POLL_INTERVAL = 2.0     # Poll interval in seconds

# Initialize the UDP socket for TSS communication
tss_sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
tss_sock.settimeout(TSS_POLL_INTERVAL)  # 1 second timeout

# Flag to control the background thread
tss_polling_active = False
tss_polling_thread = None

def poll_tss_server():
    """Background task to poll the TSS server and broadcast data to the TSS room"""
    global tss_polling_active
    
    logging.info("Starting TSS polling thread")
    while tss_polling_active:
        try:
            # Prepare the TSS request (same as your example)
            time_value = int(time.time())  # Use current time
            command = 172                  # Your TSS command
            data = 0                       # Optional data
            
            # Pack the request
            request = struct.pack('>III', time_value, command, data)
            
            # Send the request to TSS server
            tss_sock.sendto(request, (TSS_SERVER_IP, TSS_SERVER_PORT))
            
            # Receive the response
            response, _ = tss_sock.recvfrom(4096)
            
            # Process the response
            recv_time, recv_command = struct.unpack('>II', response[:8])
            data_bytes = response[8:]
            
            # Parse as list of floats (adjust according to your data format)
            floats = struct.iter_unpack('>f', data_bytes)
            values = [f[0] for f in floats]
            
            # Prepare data for clients
            tss_data = {
                'timestamp': recv_time,
                'command': recv_command,
                'values': values
            }
            
            # Broadcast to all clients in the TSS room
            socketio.emit('tss_update', tss_data, room=TSS_ROOM)
            logging.info(f"Broadcasted TSS update to {TSS_ROOM}: command={recv_command}, data_length={len(values)}")
            
        except socket.timeout:
            logging.warning("TSS server did not respond")
        except Exception as e:
            logging.error(f"Error polling TSS server: {e}")
        
        # Wait until next poll interval
        time.sleep(TSS_POLL_INTERVAL)
    
    logging.info("TSS polling thread stopped")

# Start the TSS polling thread
def start_tss_polling():
    global tss_polling_active, tss_polling_thread
    
    if not tss_polling_active:
        tss_polling_active = True
        tss_polling_thread = threading.Thread(target=poll_tss_server)
        tss_polling_thread.daemon = True  # Thread will exit when main thread exits
        tss_polling_thread.start()
        logging.info("TSS polling started")

# Stop the TSS polling thread
def stop_tss_polling():
    global tss_polling_active
    
    if tss_polling_active:
        tss_polling_active = False
        if tss_polling_thread:
            tss_polling_thread.join(timeout=2.0)  # Wait for thread to finish
        logging.info("TSS polling stopped")

# Socket events for TSS room
@socketio.on('join_tss_room')
def handle_join_tss_room():
    """Handle client request to join the TSS room"""
    sid = request.sid
    join_room(TSS_ROOM)
    
    # Track this room in the client's rooms
    if sid not in client_rooms:
        client_rooms[sid] = set()
    client_rooms[sid].add(TSS_ROOM)
    
    # Start polling if this is the first client
    if len(client_rooms) == 1:
        start_tss_polling()
    
    logging.info(f"Client {sid} joined TSS room")
    emit('join_response', {'status': 'success', 'room': TSS_ROOM})

@socketio.on('leave_tss_room')
def handle_leave_tss_room():
    """Handle client request to leave the TSS room"""
    sid = request.sid
    leave_room(TSS_ROOM)
    
    # Update room tracking
    if sid in client_rooms and TSS_ROOM in client_rooms[sid]:
        client_rooms[sid].remove(TSS_ROOM)
    
    # Check if we should stop polling (no clients left)
    has_tss_clients = any(TSS_ROOM in rooms for rooms in client_rooms.values())
    if not has_tss_clients:
        stop_tss_polling()
    
    logging.info(f"Client {sid} left TSS room")
    emit('leave_response', {'status': 'success', 'room': TSS_ROOM})

# Initialize TSS functionality when the application starts
@app.before_request
def initialize_tss():
    # Configure the TSS server from environment variables if available
    global TSS_SERVER_IP, TSS_SERVER_PORT
    
    TSS_SERVER_IP = os.environ.get('TSS_SERVER_IP', TSS_SERVER_IP)
    TSS_SERVER_PORT = int(os.environ.get('TSS_SERVER_PORT', TSS_SERVER_PORT))
    
    logging.info(f"TSS Server configured at {TSS_SERVER_IP}:{TSS_SERVER_PORT}")

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=8080,
                 debug=True, allow_unsafe_werkzeug=True)
