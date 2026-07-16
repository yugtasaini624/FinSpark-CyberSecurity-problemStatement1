import os
from dotenv import load_dotenv

load_dotenv()


class Config:

    SECRET_KEY = os.getenv(
        "SECRET_KEY",
        "aegisvault-secret-key"
    )


    JWT_SECRET_KEY = os.getenv(
        "JWT_SECRET_KEY",
        "aegisvault-jwt-secret-key"
    )


    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL"
    )


    SQLALCHEMY_TRACK_MODIFICATIONS = False


    # ==========================
    # JWT CONFIGURATION
    # ==========================

    # Token will come from Authorization header
    JWT_TOKEN_LOCATION = [
        "headers"
    ]


    # Header format:
    # Authorization: Bearer <token>
    JWT_HEADER_TYPE = "Bearer"


    # Disable cookie CSRF because we use headers
    JWT_COOKIE_CSRF_PROTECT = False


    # Token expiry (1 hour)
    JWT_ACCESS_TOKEN_EXPIRES = 3600