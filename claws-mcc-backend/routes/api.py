from flask import jsonify


def api_routes(app):

    @app.route('/api')
    def api_home():
        return jsonify("API")
