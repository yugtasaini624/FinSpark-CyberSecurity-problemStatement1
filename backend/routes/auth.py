from flask import Blueprint, request, jsonify
from models.user import User
from extensions import db
from flask_jwt_extended import create_access_token
from werkzeug.security import generate_password_hash, check_password_hash

auth_bp = Blueprint("auth", __name__)


# ==========================
# Register Employee
# ==========================
@auth_bp.route("/register", methods=["POST"])
def register():

    data = request.get_json()

    required_fields = [
        "full_name",
        "employee_id",
        "department",
        "email",
        "password"
    ]

    for field in required_fields:
        if field not in data or not data[field]:
            return jsonify({"msg": f"{field} is required"}), 400

    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"msg": "Email already exists"}), 400

    if User.query.filter_by(employee_id=data["employee_id"]).first():
        return jsonify({"msg": "Employee ID already exists"}), 400

    new_user = User(
        full_name=data["full_name"],
        employee_id=data["employee_id"],
        department=data["department"],
        email=data["email"],
        password=generate_password_hash(data["password"]),
        role="employee"
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({
        "success": True,
        "msg": "Registration Successful"
    }), 201


@auth_bp.route("/login", methods=["POST"])
def login():

    data = request.get_json()

    if "email" not in data or "password" not in data:
        return jsonify({
            "msg":"Email and Password are required"
        }),400

    # ======================================
    # FIXED ADMIN LOGIN
    # ======================================

    if (
        data["email"] == "admin@aegisvault.com"
        and
        data["password"] == "Admin@123"
    ):

        access_token = create_access_token(

            identity="0",

            additional_claims={
                "role":"admin"
            }

        )

        return jsonify({

            "success":True,

            "access_token":access_token,

            "role":"admin",

            "name":"System Administrator",

            "employee_id":"ADMIN001"

        }),200

    # ======================================
    # EMPLOYEE LOGIN
    # ======================================

    user = User.query.filter_by(
        email=data["email"]
    ).first()

    if not user:

        return jsonify({
            "msg":"Invalid Email"
        }),401

    if user.is_locked:

        return jsonify({
            "msg":"Your account has been locked by the Security Team."
        }),403

    if not check_password_hash(
        user.password,
        data["password"]
    ):

        return jsonify({
            "msg":"Wrong Password"
        }),401

    access_token = create_access_token(

        identity=str(user.id),

        additional_claims={

            "role":user.role

        }

    )

    return jsonify({

        "success":True,

        "access_token":access_token,

        "role":user.role,

        "name":user.full_name,

        "employee_id":user.employee_id

    }),200