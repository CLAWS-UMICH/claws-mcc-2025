from routes.api import api_routes
from routes.home import home_routes
from flask import Flask

from flask_cors import CORS

app = Flask(__name__)

# set cors
CORS(app)


# Import routes from separate files

# Register the routes
home_routes(app)
api_routes(app)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)
