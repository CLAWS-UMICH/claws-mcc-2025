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
import random

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*", async_mode="threading")

# set cors
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(levelname)s - %(message)s')

# Register your routes
home_routes(app)
api_routes(app)

# Load environment
load_dotenv()

# Connect to MongoDB
try:
    mongo_uri = os.getenv('MONGO_URI')
    logging.info(f"MongoDB URI: {mongo_uri}")
    client = MongoClient(mongo_uri)
    db = client['claws']  # The 'claws' database
    logging.info("MongoDB connection successful")
except Exception as e:
    logging.error(f"MongoDB connection failed: {e}")

# Put db in the flask context
@app.before_request
def before_request():
    g.db = db

# This function inserts the initial messages (if none exist)
def initialize_messages():
    # Check if messages collection is empty
    if db.messages.count_documents({}) == 0:
        initial_messages = [
            {
                "room": "MESSAGING",
                "message_id": 0,
                "sent_to": 0,   # 0 => Steve
                "message": "Hey, how's the mission going?",
                "from": 0,      # 0 => Steve
                "timestamp": datetime.now().isoformat()
            },
            {
                "room": "MESSAGING",
                "message_id": 1,
                "sent_to": 1,   # 1 => Alex
                "message": "Where should I go next?",
                "from": 1,      # 1 => Alex
                "timestamp": datetime.now().isoformat()
            },
            {
                "room": "MESSAGING",
                "message_id": 2,
                "sent_to": 3,   # 3 => Group Chat
                "message": "Hello from the group chat",
                "from": 1,      # (Alex) 
                "timestamp": datetime.now().isoformat()
            },
            {
                "room": "MESSAGING",
                "message_id": 3,
                "sent_to": 3,   # Group Chat
                "message": "Yes, I'm here too!",
                "from": 0,      # (Steve)
                "timestamp": datetime.now().isoformat()
            }
        ]
        db.messages.insert_many(initial_messages)
        logging.info("Inserted initial messages into MongoDB")

# Provide an endpoint to reset the DB
@app.route("/reset_db", methods=["POST"])
def reset_db():
    """
    Drop the 'messages' collection and re-insert initial messages.
    For example:
      curl -X POST http://localhost:8080/reset_db
    """
    db.messages.drop()
    initialize_messages()
    return {"message": "Database has been reset and initial messages inserted."}, 200

# Make sure we initialize messages when the app starts
with app.app_context():
    initialize_messages()

###############################################
#               WebSocket Events
###############################################

@socketio.on('connect')
def on_connect():
    logging.info(f"Client connected: {request.sid}")

@socketio.on('disconnect')
def handle_disconnect():
    logging.info(f"Client disconnected: {request.sid}")
    # Additional logic if needed

@socketio.on('join_room')
def handle_join_room(_data):
    room = _data.get('room', 'MESSAGING')
    join_room(room)
    logging.info(f"Client {request.sid} joined room: {room}")
    emit('room_message', {'message': f"Joined room: {room}"}, room=room)

@socketio.on('send_message')
def handle_send_message(_data):
    """
    Receives a JSON payload like:
    {
       "room": "MESSAGING",
       "message_id": 0,
       "sent_to": 0,
       "message": "Hello world!",
       "from": 1
    }
    """
    room        = _data.get("room", "MESSAGING")
    message_id  = _data.get("message_id", 0)
    sent_to     = _data.get("sent_to", 0)
    message_txt = _data.get("message", "")
    from_id     = _data.get("from", 0)
    timestamp   = datetime.now().isoformat()

    msg_doc = {
       "message_id": message_id,
       "room":       room,
       "sent_to":    sent_to,
       "message":    message_txt,
       "from":       from_id,
       "timestamp":  timestamp
    }

    try:
        result = db.messages.insert_one(msg_doc)
        msg_doc["_id"] = str(result.inserted_id)
        logging.info(f"Inserted message into DB: {msg_doc}")
    except Exception as e:
        logging.error(f"Error inserting message: {e}")

    emit("new_message", msg_doc, room=room)
    logging.info(f"Broadcast new message to room {room}: {msg_doc}")

@socketio.on('get_messages')
def handle_get_messages(_data):
    """
    Expects:
    {
      "room": "MESSAGING",
      "contact_id": <some int>
    }
    """
    room = _data.get("room", "MESSAGING")
    contact_id = _data.get("contact_id", 0)

    # We'll load all messages that have 'sent_to' == contact_id
    query = {"room": room, "sent_to": contact_id}

    try:
        messages_cursor = db.messages.find(query).sort("timestamp", 1)
        messages = []
        for doc in messages_cursor:
            doc["_id"] = str(doc["_id"])
            messages.append(doc)
        emit("load_messages", {"messages": messages}, room=request.sid)
        logging.info(f"Loaded {len(messages)} messages for contact {contact_id}")
    except Exception as e:
        logging.error(f"Error retrieving messages: {e}")
        emit("error", {"message": "Could not retrieve messages"}, room=request.sid)

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=8080,
                 debug=True, allow_unsafe_werkzeug=True)
