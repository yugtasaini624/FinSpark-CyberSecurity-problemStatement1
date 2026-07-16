import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/login.css";
import axios from "axios";

function Login() {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);

  const [formData, setFormData] = useState({
    full_name: "",
    employee_id: "",
    department: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

        if (isLogin) {

            const res = await axios.post(
                "http://127.0.0.1:5000/api/auth/login",
                {
                    email: formData.email,
                    password: formData.password
                }
            );

            // Save user details
            localStorage.setItem("token", res.data.access_token);
            localStorage.setItem("role", res.data.role);
            localStorage.setItem("name", res.data.name);
            localStorage.setItem("employee_id", res.data.employee_id);

            // Redirect based on role
            if (res.data.role === "admin") {

                navigate("/admin-dashboard");

            } else {

                navigate("/employee-dashboard");

            }

        } else {

            await axios.post(
                "http://127.0.0.1:5000/api/auth/register",
                formData
            );

            alert("Registration Successful!");

            setIsLogin(true);

            setFormData({
                full_name: "",
                employee_id: "",
                department: "",
                email: "",
                password: ""
            });

        }

    } catch (err) {

        alert(
            err.response?.data?.msg ||
            err.response?.data?.message ||
            "Something went wrong"
        );

    }
};

  return (
    <div className="login-page">

      <div className="login-card">

        <h1>AegisVault AI</h1>

        <p>
          AI Powered Insider Threat Detection &
          Privileged Access Protection
        </p>

        <div className="tabs">

          <button
            type="button"
            className={isLogin ? "active-tab" : ""}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>

          <button
            type="button"
            className={!isLogin ? "active-tab" : ""}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>

        </div>

        <form onSubmit={handleSubmit}>

          {!isLogin && (
            <>
              <input
                type="text"
                placeholder="Full Name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                placeholder="Employee ID"
                name="employee_id"
                value={formData.employee_id}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                placeholder="Department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
              />
            </>
          )}

          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="login-btn-main"
          >
            {isLogin ? "Login" : "Create Account"}
          </button>

        </form>

        <div className="bottom-text">

          {isLogin ? (
            <>
              Don't have an account?
              <span onClick={() => setIsLogin(false)}>
                {" "}Register
              </span>
            </>
          ) : (
            <>
              Already have an account?
              <span onClick={() => setIsLogin(true)}>
                {" "}Login
              </span>
            </>
          )}

        </div>

      </div>

    </div>
  );
}

export default Login;