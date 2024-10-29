from flask import jsonify, g
from bson.json_util import dumps


def api_routes(app):

    @app.route('/api')
    def api_home():
        return jsonify("API")

    @app.route('/frontend')
    def frontend():
        return "Frontend WebSocket Endpoint"

    @app.route('/hololens')
    def hololens():
        return "HoloLens WebSocket Endpoint"

    @app.route('/api/tasklist/', methods=['GET'])
    def tasklist():
        print("GET /api/tasklist/")
        db = g.db
        tasklist = db.tasklist

        tasks = tasklist.find()
        tasks = list(tasks)

        return jsonify(dumps(tasks))
