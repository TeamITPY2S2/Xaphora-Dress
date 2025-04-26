import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Clear previous message
    try {
      const response = await fetch("http://localhost:8070/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userType", data.userType);

        setMessage("Login successful!");

        // Redirect based on role
        if (data.userType === "super-admin") {
          navigate("/superadmin");
        } else if (data.userType === "admin") {
          navigate("/dashboard");
        } else if (data.userType === "user") {
          navigate("/home");
        } else {
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
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className="login-label password-label">PASSWORD</label>
          <input
            type="password"
            className="login-input"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
          <Link to="/seller/login" className="login-link">Log as a <b>Seller</b></Link>
        </p>
      </div>
      <Footer />
    </>
  );
}

export default Login;