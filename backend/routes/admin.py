from flask import send_from_directory
import os

from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from extensions import db

from models.user import User
from models.activity import ActivityLog
from models.evidence import Evidence

admin_bp = Blueprint("admin", __name__)


# ======================================
# Dashboard Statistics
# ======================================

@admin_bp.route("/dashboard", methods=["GET"])
@jwt_required()
def dashboard():

    total_employees = User.query.filter_by(role="employee").count()

    locked_employees = User.query.filter_by(
        is_locked=True
    ).count()

    total_activities = ActivityLog.query.count()

    total_evidence = Evidence.query.count()

    critical_alerts = ActivityLog.query.filter(
        ActivityLog.risk_score >= 80
    ).count()

    return jsonify({

        "totalEmployees": total_employees,

        "activeEmployees": total_employees - locked_employees,

        "lockedEmployees": locked_employees,

        "criticalAlerts": critical_alerts,

        "totalEvidence": total_evidence,

        "todayActivities": total_activities

    })


# ======================================
# Employee List
# ======================================

@admin_bp.route("/users", methods=["GET"])
@jwt_required()
def all_users():

    users = User.query.filter_by(
        role="employee"
    ).all()

    result = []

    for user in users:

        latest = ActivityLog.query.filter_by(
            user_id=user.id
        ).order_by(
            ActivityLog.timestamp.desc()
        ).first()

        risk = latest.risk_score if latest else 0

        trust = max(0, 100-risk)

        result.append({

            "id": user.id,

            "name": user.full_name,

            "employee_id": user.employee_id,

            "department": user.department,

            "riskScore": risk,

            "trustScore": trust,

            "locked": user.is_locked

        })

    return jsonify(result)


# ======================================
# Employee Investigation
# ======================================

@admin_bp.route("/user/<int:user_id>", methods=["GET"])
@jwt_required()
def single_user(user_id):

    user = User.query.get(user_id)

    if not user:

        return jsonify({
            "message":"User not found"
        }),404

    logs = ActivityLog.query.filter_by(
        user_id=user.id
    ).order_by(
        ActivityLog.timestamp.desc()
    ).all()

    activities=[]

    highest=0

    for log in logs:

        if log.risk_score>highest:

            highest=log.risk_score

        activities.append({

            "action":log.action,

            "risk":log.risk_score,

            "time":log.timestamp.strftime("%d-%m-%Y %H:%M")

        })

    evidence=Evidence.query.filter_by(
        user_id=user.id
    ).all()

    files=[]

    for e in evidence:

        files.append({

            "action":e.action,

            "risk":e.risk_score,

            "screenshot":e.screenshot,

            "recording":e.recording,

            "status":e.status,

            "time":e.created_at.strftime("%d-%m-%Y %H:%M")

        })

    return jsonify({

        "employee":{

            "id":user.id,

            "name":user.full_name,

            "employeeId":user.employee_id,

            "department":user.department,

            "locked":user.is_locked,

            "trustScore":max(0,100-highest)

        },

        "activities":activities,

        "evidence":files

    })


# ======================================
# Unlock Employee
# ======================================

@admin_bp.route("/unlock/<int:user_id>", methods=["POST"])
@jwt_required()
def unlock(user_id):

    user = User.query.get(user_id)

    if not user:

        return jsonify({
            "message":"User not found"
        }),404

    user.is_locked=False

    db.session.commit()

    return jsonify({

        "success":True,

        "message":"Employee Unlocked"

    })

# ======================================
# Live Incident Feed
# ======================================

@admin_bp.route("/live-feed", methods=["GET"])
@jwt_required()
def live_feed():

    logs = ActivityLog.query.order_by(
        ActivityLog.timestamp.desc()
    ).limit(30).all()

    feed = []

    for log in logs:

        user = User.query.get(log.user_id)

        feed.append({

            "employee": user.full_name,

            "employee_id": user.employee_id,

            "action": log.action,

            "risk": log.risk_score,

            "status": "Critical" if log.risk_score >= 80 else "Warning" if log.risk_score >= 50 else "Safe",

            "time": log.timestamp.strftime("%d-%m-%Y %H:%M:%S")

        })

    return jsonify(feed)

# ======================================
# AI Investigation Report
# ======================================

@admin_bp.route("/ai-report/<int:user_id>", methods=["GET"])
@jwt_required()
def ai_report(user_id):

    user = User.query.get(user_id)

    if not user:

        return jsonify({
            "message": "User not found"
        }),404

    logs = ActivityLog.query.filter_by(
        user_id=user_id
    ).order_by(
        ActivityLog.timestamp.desc()
    ).all()

    if not logs:

        return jsonify({
            "message":"No Activities"
        })

    highest = max(log.risk_score for log in logs)

    if highest >= 90:

        level = "Critical"

        recommendation = "Immediately suspend employee session and investigate all evidence."

    elif highest >= 70:

        level = "High"

        recommendation = "Require manager approval before allowing further privileged actions."

    elif highest >= 40:

        level = "Medium"

        recommendation = "Continue monitoring and verify employee behaviour."

    else:

        level = "Low"

        recommendation = "No immediate action required."

    reasons = []

    for log in logs:

        if log.risk_score >= 80:

            reasons.append(log.action)

    return jsonify({

        "employee": user.full_name,

        "riskScore": highest,

        "trustScore": max(0, 100-highest),

        "riskLevel": level,

        "reasons": reasons,

        "recommendation": recommendation

    })

# ======================================
# View Recording
# ======================================

UPLOAD_FOLDER = "uploads/recordings"


from flask import send_from_directory

UPLOAD_FOLDER = "uploads/recordings"

@admin_bp.route("/recording/<filename>", methods=["GET"])
def get_recording(filename):

    return send_from_directory(
        UPLOAD_FOLDER,
        filename,
        as_attachment=False
    )



