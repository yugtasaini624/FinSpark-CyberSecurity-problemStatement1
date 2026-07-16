from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

import os
from datetime import datetime

from extensions import db
from models.user import User
from models.evidence import Evidence


upload_bp = Blueprint("upload", __name__)

SCREENSHOT_FOLDER = "uploads/screenshots"
RECORDING_FOLDER = "uploads/recordings"

os.makedirs(SCREENSHOT_FOLDER, exist_ok=True)
os.makedirs(RECORDING_FOLDER, exist_ok=True)


# ======================================
# Upload Screenshot
# ======================================

@upload_bp.route("/screenshot", methods=["POST"])
@jwt_required()
def upload_screenshot():

    user_id = int(get_jwt_identity())

    user = User.query.get(user_id)

    if not user:
        return jsonify({
            "message": "User not found"
        }), 404

    file = request.files.get("image")

    if not file:
        return jsonify({
            "message": "No screenshot found"
        }), 400

    filename = (
        "screenshot_"
        + str(user.id)
        + "_"
        + datetime.now().strftime("%Y%m%d%H%M%S")
        + ".png"
    )

    path = os.path.join(
        SCREENSHOT_FOLDER,
        filename
    )

    file.save(path)

    # Update latest evidence instead of creating a new one
    evidence = (
        Evidence.query
        .filter_by(user_id=user.id)
        .order_by(Evidence.created_at.desc())
        .first()
    )

    if evidence:
        evidence.screenshot = filename
        db.session.commit()

    return jsonify({
        "success": True,
        "screenshot": filename
    })


# ======================================
# Upload Recording
# ======================================

@upload_bp.route("/recording", methods=["POST"])
def upload_recording():

    file = request.files.get("video")

    if not file:
        return jsonify({
            "message": "No video found"
        }), 400

    filename = (
        "recording_"
        + datetime.now().strftime("%Y%m%d%H%M%S")
        + ".webm"
    )

    path = os.path.join(RECORDING_FOLDER, filename)

    file.save(path)

    evidence = Evidence(
        user_id=0,
        employee_name="Unknown",
        action="Session Recording",
        risk_score=0,
        screenshot=None,
        recording=filename,
        status="Completed"
    )

    db.session.add(evidence)
    db.session.commit()

    return jsonify({
        "success": True,
        "recording": filename
    })