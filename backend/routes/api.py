from flask import jsonify, g
from bson.json_util import dumps
db = g.db

def api_routes(app):

    @app.route('/api')
    def api_home():
        return jsonify("API")

    @app.route('/api/tasklist/', methods=['GET'])
    def tasklist():
        print("GET /api/tasklist/")
        db = g.db
        tasklist = db.tasklist

        tasks = tasklist.find()
        tasks = list(tasks)

        return jsonify(dumps(tasks))
    
    # base site ?
    @app.route('/api/notifications/', methods=['GET'])
    def notifications():
        
        notifications = db.notifications # does this even exist

        notifs = notifications.find()
        notifs = list(notifs)
    

    # click mark as done
    @app.route('/notifications/mark_done', methods=['POST'])
    def mark_notifications():

        # mark all notifs as read this is pseudocode rn
        result = db.notifications.update_one(
            {"$set": {"read": True}}
        )
    
    # respond to messages
    @app.route('/notifications/respond', methods=['POST'])
    def respond():
        data = request.get_json()
        response = data.get("response")
        # lol this is wrong