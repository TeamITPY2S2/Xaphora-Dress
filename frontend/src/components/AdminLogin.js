import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch("http://localhost:8070/api/auth/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.userType !== 'admin' && data.userType !== 'super-admin' && data.userType !== 'order-management') {
          setMessage("Access denied. Admin privileges required.");
          return;
        }

        // Store admin data
        localStorage.setItem("token", data.token);
        localStorage.setItem("userType", data.userType);
        localStorage.setItem("userId", data.user._id);
        
        if (data.user?.firstName) {
          const fullName = `${data.user.firstName} ${data.user.lastName || ""}`.trim();
          localStorage.setItem("userName", fullName);
        }

        setMessage("Login successful!");
        
        // Redirect based on user type
        if (data.userType === 'super-admin') {
          navigate("/superadmin");
        } else if (data.userType === 'order-management') {
          navigate("/admin-orders");
        } else {
          navigate("/admin/dashboard");
        }
      } else {
        setMessage(data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-box">
        <h2>Admin Order Management</h2>
        <h3>Login</h3>
        {message && <div className="admin-login-message">{message}</div>}
        
        <form className="admin-login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="admin-login-button">
            Login to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin; 