from extensions import db
from datetime import datetime


class Evidence(db.Model):

    __tablename__ = "evidence"

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(db.Integer, nullable=False)

    employee_name = db.Column(db.String(100), nullable=False)

    action = db.Column(db.String(255), nullable=False)

    risk_score = db.Column(db.Integer, nullable=False)

    screenshot = db.Column(db.String(255))

    recording = db.Column(db.String(255))

    status = db.Column(
        db.String(100),
        default="Pending Investigation"
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )