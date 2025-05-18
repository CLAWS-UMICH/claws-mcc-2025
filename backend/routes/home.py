from flask import jsonify


def home_routes(app):

    @app.route('/')
    def home():
        return jsonify(message="home")
