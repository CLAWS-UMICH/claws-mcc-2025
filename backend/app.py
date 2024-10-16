from dotenv import load_dotenv
from routes.api import api_routes
from routes.home import home_routes
from flask import Flask, g

from flask_cors import CORS
from pymongo import MongoClient
import os

app = Flask(__name__)

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


@app.before_request
def before_request():
    g.db = db


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)
