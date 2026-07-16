from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from extensions import db

from models.user import User
from models.activity import ActivityLog
from models.evidence import Evidence

from services.policy_engine import check_permission
from services.risk_engine import calculate_risk, ai_explanation


activity_bp = Blueprint("activity", __name__)


# ==========================================
# Log Employee Activity
# ==========================================

@activity_bp.route("/log", methods=["POST"])
@jwt_required()
def log_activity():

    user_id = int(get_jwt_identity())

    user = User.query.get(user_id)

    if not user:
        return jsonify({
            "message": "User not found"
        }), 404

    data = request.get_json()

    action = data.get("action")
    recording = data.get("recording")
    screenshot = data.get("screenshot")

    if not action:
        return jsonify({
            "message": "Action missing"
        }), 400

    print("USER ROLE:", user.role)
    print("ACTION:", action)

    # ===============================
    # ACCESS CONTROL CHECK
    # ===============================

    allowed, required_role = check_permission(
        user.role,
        action
    )

    if not allowed:

        risk = 90

        explanation = (
            f"Unauthorized action blocked. "
            f"{action} requires {required_role} access."
        )

        blocked_activity = ActivityLog(
            user_id=user.id,
            action="BLOCKED: " + action,
            risk_score=risk
        )

        db.session.add(blocked_activity)

        evidence = Evidence(
            user_id=user.id,
            employee_name=user.full_name,
            action="BLOCKED: " + action,
            risk_score=risk,
            screenshot=screenshot,
            recording=recording,
            status="Pending Investigation"
        )

        db.session.add(evidence)

        db.session.commit()

        return jsonify({
            "success": False,
            "blocked": True,
            "risk": risk,
            "status": "Critical",
            "requiredRole": required_role,
            "yourRole": user.role,
            "message": explanation
        })

    # ===============================
    # NORMAL ACTIVITY
    # ===============================

    risk = calculate_risk(action)

    explanation = ai_explanation(risk)

    if risk >= 90:
        user.is_locked = True

    activity = ActivityLog(
        user_id=user.id,
        action=action,
        risk_score=risk
    )

    db.session.add(activity)

    # Save evidence for risky actions
    if risk >= 50:

        evidence = Evidence(
            user_id=user.id,
            employee_name=user.full_name,
            action=action,
            risk_score=risk,
            screenshot=screenshot,
            recording=recording,
            status="Pending Investigation"
        )

        db.session.add(evidence)

    db.session.commit()

    return jsonify({
        "success": True,
        "employee": user.full_name,
        "risk": risk,
        "status":
            "Critical" if risk >= 80
            else "Warning" if risk >= 50
            else "Safe",
        "locked": user.is_locked,
        "explanation": explanation
    })


# ==========================================
# Employee Activity History
# ==========================================

@activity_bp.route("/my-activities", methods=["GET"])
@jwt_required()
def my_activities():


    user_id = int(get_jwt_identity())


    logs = ActivityLog.query.filter_by(

        user_id=user_id

    ).order_by(

        ActivityLog.timestamp.desc()

    ).all()



    result=[]



    for log in logs:

        result.append({

            "id":log.id,

            "action":log.action,

            "risk_score":log.risk_score,

            "time":log.timestamp.strftime(
                "%d-%m-%Y %H:%M:%S"
            )

        })



    return jsonify(result)





# ==========================================
# Admin Evidence List
# ==========================================

@activity_bp.route("/evidence", methods=["GET"])
@jwt_required()
def get_evidence():


    evidences = Evidence.query.order_by(

        Evidence.created_at.desc()

    ).all()



    result=[]


    for item in evidences:


        result.append({

            "id":item.id,

            "employee_name":item.employee_name,

            "action":item.action,

            "risk_score":item.risk_score,

            "screenshot":item.screenshot,

            "recording":item.recording,

            "status":item.status,

            "time":item.created_at.strftime(
                "%d-%m-%Y %H:%M:%S"
            )

        })


    return jsonify(result)





# ==========================================
# Single Evidence
# ==========================================

@activity_bp.route("/evidence/<int:evidence_id>", methods=["GET"])
@jwt_required()
def get_single_evidence(evidence_id):


    evidence = Evidence.query.get(evidence_id)



    if not evidence:

        return jsonify({

            "message":"Evidence not found"

        }),404



    return jsonify({

        "id":evidence.id,

        "employee_name":evidence.employee_name,

        "action":evidence.action,

        "risk_score":evidence.risk_score,

        "screenshot":evidence.screenshot,

        "recording":evidence.recording,

        "status":evidence.status,

        "time":evidence.created_at.strftime(
            "%d-%m-%Y %H:%M:%S"
        ),

        "ai_analysis":ai_explanation(
            evidence.risk_score
        )

    })

# ==========================================
# Check Permission Before Action
# ==========================================

@activity_bp.route("/check-access", methods=["POST"])
@jwt_required()
def check_access():

    user_id = int(get_jwt_identity())

    user = User.query.get(user_id)

    if not user:

        return jsonify({
            "message":"User not found"
        }),404


    data = request.get_json()

    action = data.get("action")


    allowed, required_role = check_permission(
        user.role,
        action
    )


    return jsonify({

        "allowed": allowed,

        "required_role": required_role,

        "your_role": user.role

    })

@activity_bp.route("/my-permissions", methods=["GET"])
@jwt_required()
def my_permissions():

    user_id = int(get_jwt_identity())

    user = User.query.get(user_id)

    if not user:

        return jsonify({
            "message":"User not found"
        }),404


    permission_list = {

        "employee":[
            "Viewed Customers Database",
            "Updated Customer Record",
            "Generated Monthly Report"
        ],

        "manager":[
            "Viewed Customers Database",
            "Updated Customer Record",
            "Generated Monthly Report",
            "Exported Database"
        ],

        "admin":[
            "Viewed Customers Database",
            "Updated Customer Record",
            "Generated Monthly Report",
            "Exported Database",
            "Deleted Customer Record",
            "Attempted Admin File Access"
        ]

    }


    role = user.role.lower()


    return jsonify({

        "role":role,

        "permissions":
        permission_list.get(role,[])

    })