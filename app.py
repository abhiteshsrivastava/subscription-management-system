
import os

from flask import Flask, jsonify
from config import Config
from database import db
from routes.auth import auth_bp


def create_app():

    app = Flask(__name__)
    app.config.from_object(Config)

    os.makedirs(
        os.path.join(os.path.dirname(__file__), "database"),
        exist_ok=True
    )

    db.init_app(app)

    # Register API routes
    app.register_blueprint(auth_bp)

    # Create database tables
    with app.app_context():
        db.create_all()

    # Home route
    @app.route("/")
    def home():
        return jsonify({
            "success": True,
            "message": "Welcome to Brightloop Backend API",
            "version": "1.0"
        })

    # Health check
    @app.route("/api/health")
    def health():
        return jsonify({
            "success": True,
            "status": "Backend running",
            "database": "Connected"
        })

    return app


app = create_app()


if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )
