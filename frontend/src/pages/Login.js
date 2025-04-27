// src/pages/Login.js
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Login() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage]   = useState("");
  const navigate                = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch("http://localhost:8070/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store user data
        localStorage.setItem("token", data.token);
        localStorage.setItem("userType", data.userType);
        localStorage.setItem("userId", data.user._id);
        
        if (data.user?.firstName) {
          const fullName = `${data.user.firstName} ${data.user.lastName || ""}`.trim();
          localStorage.setItem("userName", fullName);
        }

        setMessage("Login successful!");

        // Redirect based on user type
        if (data.userType === "super-admin") {
          navigate("/superadmin");
        } else if (data.userType === "admin") {
          navigate("/admin/dashboard");
        } else if (data.userType === "order-management") {
          navigate("/admin-orders");
        } else {
          // Buyer / user
          navigate("/home");
        }
      } else {
        setMessage(data.message || "Invalid email or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="login-container">
        <h2 className="login-title">LOGIN</h2>
        {message && <div className="login-message">{message}</div>}
        <form className="login-form" onSubmit={handleSubmit}>
          <label className="login-label">EMAIL</label>
          <input
            type="email"
            className="login-input"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
          />

          <label className="login-label password-label">PASSWORD</label>
          <input
            type="password"
            className="login-input"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          <button type="submit" className="login-button">LOG IN</button>
        </form>

        <p className="login-footer">
          <Link to="/forgot-password" className="login-link">Forgot your password?</Link>
        </p>
        <p className="login-footer">
          Create Account <Link to="/signup" className="login-link">Sign Up</Link>
        </p>
        <p className="login-footer">
          <Link to="/admin/login" className="login-link">
            Log in as an <b>Admin</b>
          </Link>
        </p>
      </div>
      <Footer />
    </>
  );
}

export default Login;
