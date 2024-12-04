from flask import Flask, jsonify, request, g
from bson.json_util import dumps


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

    @app.route('/api/number', methods=['GET', 'POST'])
    def manage_number():
        db = g.db
        demo_data = db.demoData 

        if request.method == 'GET':
            # Retrieve the first document in the collection
            data = demo_data.find_one()
            if data:
                return jsonify(number=data['number'])
            else:
                # If no document exists, return 0 or any default value
                return jsonify(number=0)

        elif request.method == 'POST':
            # Retrieve the number from the request data
            new_number = request.json.get('number', 0)

            # Update or insert the document with the new number
            demo_data.update_one({}, {"$set": {"number": new_number}}, upsert=True)
            
            return jsonify(success=True, number=new_number)
