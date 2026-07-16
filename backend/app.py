from flask import Flask
from flask_cors import CORS

from config import Config
from extensions import db, jwt, bcrypt


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app)

    db.init_app(app)
    jwt.init_app(app)
    bcrypt.init_app(app)

    # Import models after db initialization
    from models.user import User
    from routes.auth import auth_bp
    from models.activity import ActivityLog
    from routes.activity import activity_bp
    from models.evidence import Evidence
    from routes.upload import upload_bp
    from routes.admin import admin_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(activity_bp, url_prefix="/api/activity")
    app.register_blueprint(upload_bp, url_prefix="/api/upload")
    app.register_blueprint(
        admin_bp,
        url_prefix="/api/admin"
    )

    with app.app_context():
        db.create_all()
        print("✅ Database Created Successfully")

    @app.route("/")
    def home():
        return {
            "message": "🚀 SentinelDNA Backend Running Successfully"
        }

    return app


app = create_app()

if __name__ == "__main__":
    app.run(debug=True)