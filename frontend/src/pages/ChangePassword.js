// src/pages/ChangePassword.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UpdateBuyerProfile.css"; // Reuse same styling as Update Profile
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const ChangePassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:8070/api/auth/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Password changed successfully!");
        navigate("/dashboard");
      } else {
        setMessage(data.message || "Failed to change password");
      }
    } catch (err) {
      setMessage("Server error");
    }
  };

  return (
    <>
      <Navbar />
      <div className="update-profile-wrapper">
        <div className="update-header">
          <h1>Change Password</h1>
        </div>

        <form onSubmit={handleSubmit} className="update-form">
          <h2>Enter Your Password</h2>
          {message && <p className="error">{message}</p>}
          <label>
            Current Password:
            <input
              type="password"
              name="oldPassword"
              value={formData.oldPassword}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            New Password:
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              required
            />
          </label>

          <div className="button-group">
            <button type="submit" className="update-btn">Change Password</button>
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate("/dashboard")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default ChangePassword;