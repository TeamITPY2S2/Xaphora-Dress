// src/pages/ResetPassword.js
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Auth.css";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch(`http://localhost:8070/api/auth/reset-password/${token}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Password updated successfully");
        navigate("/api/auth/login");
      } else {
        setMessage(data.message || "Invalid or expired token");
      }
    } catch {
      setMessage("Server error");
    }
  };

  return (
    <div className="auth-container">
      <h2>Reset Password</h2>
      {message && <p className="auth-message">{message}</p>}
      <form onSubmit={handleSubmit}>
        <label>New Password:</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
}

export default ResetPassword;