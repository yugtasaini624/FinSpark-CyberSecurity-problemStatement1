import "./../css/navbar.css";
import { Link } from "react-router-dom";
import { FaShieldAlt } from "react-icons/fa";

function Navbar() {
  return (
    <nav className="navbar">

      <div className="container navbar-container">

        <div className="logo">

          <FaShieldAlt className="logo-icon"/>

          <span>AegisVault AI</span>

        </div>

        <div className="nav-links">

          <a href="#features">Features</a>

          <a href="#workflow">Workflow</a>

          <a href="#about">About</a>

        </div>

        <Link to="/login">
          <button className="login-btn">
            Login
          </button>
        </Link>

      </div>

    </nav>
  );
}

export default Navbar;