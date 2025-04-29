// src/pages/ForgotPassword.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Auth.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        "http://localhost:8070/api/auth/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
      const data = await res.json();

      if (res.ok) {
        alert("Check your email for the reset link.");
        setEmail("");
        setTimeout(() => navigate("/api/auth/login"), 2000);
      } else {
        alert(data.message || "Failed to send reset email.");
      }
    } catch (err) {
      alert("Server error. Please try again later.");
    }
  };

  return (
    <>
      <Navbar />

      <div className="auth-card">
        <h2 className="auth-title">Forgot Password</h2>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              className="auth-input"
              type="email"
              placeholder="you@example.com"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button type="submit" className="auth-button">
            Send Reset Link
          </button>
          <button
            type="button"
            className="auth-button-secondary"
            onClick={() => navigate("/api/auth/login")}
          >
            Back to Login
          </button>
        </form>
      </div>

      <Footer />
    </>
  );
}

export default ForgotPassword;