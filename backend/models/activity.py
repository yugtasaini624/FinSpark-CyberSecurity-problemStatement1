from extensions import db
from datetime import datetime


class ActivityLog(db.Model):

    __tablename__ = "activity_logs"

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(db.Integer, nullable=False)

    action = db.Column(db.String(255), nullable=False)

    risk_score = db.Column(db.Integer, default=0)

    timestamp = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )