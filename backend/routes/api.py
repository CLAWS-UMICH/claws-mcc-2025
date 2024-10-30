from flask import jsonify, request, g
from bson import ObjectId

def api_routes(app):
    @app.route('/api')
    def api_home():
        return jsonify("API is working")

    @app.route('/api/todo/', methods=['GET'])
    def get_todos():
        db = g.db
        todos_collection = db.todo
        todos = todos_collection.find()
        todos_list = [{"_id": str(todo["_id"]), "todo_name": todo["todo_name"]} for todo in todos]

        return jsonify(todos_list), 200

    @app.route('/api/todo/', methods=['POST'])
    def add_todo():
        db = g.db
        todos_collection = db.todo

        data = request.get_json()
        todo_name = data.get('todo_name')

        result = todos_collection.insert_one({"todo_name": todo_name})
        new_id = str(result.inserted_id)
        print(f"Todo created with ID: {new_id}") 
        return jsonify({"id": new_id}), 201

    @app.route('/api/todo/<string:todo_id>', methods=['DELETE'])
    def delete_todo(todo_id):
        db = g.db
        todos_collection = db.todo
        result = todos_collection.delete_one({"_id": ObjectId(todo_id)})
        if result.deleted_count == 0:
            return jsonify({"error": "Todo not found"}), 404
        return jsonify({"message": "Todo deleted successfully"}), 200
       
