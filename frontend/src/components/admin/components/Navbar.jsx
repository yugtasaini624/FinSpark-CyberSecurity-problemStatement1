import { motion } from "framer-motion";
import { FiSearch, FiBell, FiSettings, FiShield } from "react-icons/fi";
import "./Navbar.css";

function Navbar() {
  return (
    <motion.nav
      className="admin-navbar"
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >

      <div className="navbar-left">

        <div className="logo">
          <FiShield />
          <span>AegisVault AI</span>
        </div>

      </div>


      <div className="navbar-center">

        <div className="search-box">
          <FiSearch />
          <input 
            type="text"
            placeholder="Search employees, cases..."
          />
        </div>

      </div>


      <div className="navbar-right">

        <button className="icon-btn">
          <FiBell />
        </button>


        <button className="icon-btn">
          <FiSettings />
        </button>


        <div className="admin-profile">
          <div className="avatar">
            A
          </div>

          <div>
            <h4>Admin</h4>
            <span>Security Officer</span>
          </div>

        </div>

      </div>

    </motion.nav>
  );
}

export default Navbar;