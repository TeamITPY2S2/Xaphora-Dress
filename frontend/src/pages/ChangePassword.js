import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UpdateBuyerProfile.css"; // Shared styling
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FaBars, FaEye, FaEyeSlash } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ChangePassword = () => {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const getStrength = (password) => {
    if (!password) return "";
    if (password.length < 6) return "Weak";
    if (password.match(/[A-Z]/) && password.match(/[0-9]/) && password.length >= 8) return "Strong";
    return "Medium";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const { oldPassword, newPassword, confirmPassword } = formData;

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:8070/api/auth/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Password changed successfully!");
        setTimeout(() => navigate("/dashboard"), 2000);
      } else {
        toast.error(data.message || "Failed to change password");
      }
    } catch (err) {
      toast.error("Server error");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    navigate("/home");
  };

  const handleDeleteProfile = async () => {
    if (!window.confirm("Are you sure you want to delete your profile?")) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:8070/api/dashboard/profile/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        alert("Your account has been deleted successfully.");
        handleLogout();
      } else {
        alert(data.message || "Failed to delete your account.");
      }
    } catch (err) {
      console.error("Error deleting profile:", err);
      alert("Error deleting your profile.");
    }
  };

  const handleChangePassword = () => {
    navigate("/change-password");
  };

  return (
    <>
      <Navbar />
      <ToastContainer />
      <div className="update-profile-wrapper">
        <div className="update-header">

        </div>

        <form onSubmit={handleSubmit} className="update-form">
          <h2>Change Password</h2>
          {message && <p className="error">{message}</p>}

          {/* Current Password */}
          <label>
            Current Password:
            <div className="password-wrapper">
              <input
                type={showPasswords ? "text" : "password"}
                name="oldPassword"
                value={formData.oldPassword}
                onChange={handleChange}
                required
              />
              <span className="toggle-icon" onClick={() => setShowPasswords(!showPasswords)}>
                {showPasswords ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </label>

          {/* New Password */}
          <label>
            New Password:
            <div className="password-wrapper">
              <input
                type={showPasswords ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                required
              />
              <span className="toggle-icon" onClick={() => setShowPasswords(!showPasswords)}>
                {showPasswords ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <div className={`password-strength ${getStrength(formData.newPassword).toLowerCase()}`}>
              Strength: {getStrength(formData.newPassword)}
            </div>
          </label>

          {/* Confirm Password */}
          <label>
            Confirm New Password:
            <div className="password-wrapper">
              <input
                type={showPasswords ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <span className="toggle-icon" onClick={() => setShowPasswords(!showPasswords)}>
                {showPasswords ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
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