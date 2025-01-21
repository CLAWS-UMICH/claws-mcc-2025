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


@socketio.on('send_to_room')
def handle_send_to_room(_data):
    room = _data['room']
    # ------------------------------------
    # TASKLIST Feature
    # ------------------------------------
    if room == "TASKLIST":
        # The incoming message presumably has the structure:
        # {
        #   "id": 1,
        #   "type": "TaskList",
        #   "use": "POST"/"PUT"/"DELETE"/"GET",
        #   "data": { "AllTasks": [ ... ] }  or for DELETE { "task_id": X }
        # }
        message = _data.get('message', {})
        if not message or message.get("type") != "TaskList":
            # Not a valid TaskList request
            emit('room_data', {'error': "Invalid TaskList request"}, room=room)
            return

        use_method = message.get("use", "").upper()
        db = g.db
        tasklist_collection = db.tasklist

        if use_method == "GET":
            # Return all tasks
            all_tasks = get_all_tasks_from_db(db)
            # Convert to JSON-serializable
            tasks_json = json.loads(json.dumps(all_tasks, default=str))
            emit('room_data', {"data": tasks_json}, room=room)

        elif use_method == "POST":
            # Insert tasks. The "data" field should have "AllTasks"
            all_tasks = message.get("data", {}).get("AllTasks", [])
            for t in all_tasks:
                # Enforce subtask emergency inheritance
                enforce_subtask_emergency(t, t.get("isEmergency", False))
                # Insert the main task as one document in the collection
                if not t.get("isSubtask"):
                    # main task
                    tasklist_collection.insert_one(t)
                else:
                    # If for some reason a subtask with isSubtask=True
                    # is passed at top-level, ignore or handle as needed
                    pass
            emit('room_data', {"success": True, "action": "POST"}, room=room)

        elif use_method == "PUT":
            # Update tasks. 
            # Instruction says: "simply send the list of complete tasks 
            # that need to be modified and we will iterate to change them"
            all_tasks = message.get("data", {}).get("AllTasks", [])
            for updated_task in all_tasks:
                enforce_subtask_emergency(updated_task, updated_task.get("isEmergency", False))
                # Upsert by main task_id (only if isSubtask=False)
                if not updated_task.get("isSubtask"):
                    main_id = updated_task["task_id"]
                    # Replace the entire document with updated_task
                    tasklist_collection.replace_one(
                        {"task_id": main_id, "isSubtask": False},
                        updated_task,
                        upsert=True
                    )
                else:
                    # If they want to update a subtask directly, you would
                    # find the parent doc and update its subtask array.
                    # For simplicity, ignoring direct subtask PUT
                    pass

            emit('room_data', {"success": True, "action": "PUT"}, room=room)

        elif use_method == "DELETE":
            # "PUT and DELETE methods would just be a json containing the int of the task ID."
            # We only delete main tasks
            data_payload = message.get("data", {})
            # Could be { "task_id": X } or something similar
            task_id = data_payload.get("task_id")
            if task_id is None:
                # Maybe they put it at top-level
                task_id = message.get("task_id")
            if task_id is not None:
                # Delete if it's a main task
                result = tasklist_collection.delete_one({
                    "task_id": task_id, 
                    "isSubtask": False
                })
                if result.deleted_count == 1:
                    emit('room_data', {"success": True, "deleted_task_id": task_id}, room=room)
                else:
                    emit('room_data', {"success": False, 
                                       "reason": "Main task not found or subtask attempted"}, 
                         room=room)
            else:
                emit('room_data', {"success": False, 
                                   "reason": "No task_id provided"}, room=room)

        else:
            emit('room_data', {"error": f"Unsupported use method: {use_method}"}, room=room)
        return

    # If no special handling, just broadcast the incoming "message" if present
    data = _data.get('message', 'No message provided.')
    logging.info(f"Sent message to room {room}: {data}")
    emit('room_data', {'data': data}, room=room)


if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=8080,
                 debug=True, allow_unsafe_werkzeug=True)
