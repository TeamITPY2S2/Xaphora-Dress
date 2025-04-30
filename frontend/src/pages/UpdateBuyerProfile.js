import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UpdateBuyerProfile.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FaBars } from "react-icons/fa";

const UpdateBuyerProfile = () => {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchBuyer = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("http://localhost:8070/api/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok && data.userType === "buyer") {
          setFormData({
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            email: data.email || "",
          });
        } else {
          navigate("/api/auth/login");
        }
      } catch {
        setMessage("Failed to fetch buyer details.");
      }
    };
    fetchBuyer();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const handleChangePassword = () => {
    navigate("/change-password");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:8070/api/dashboard/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Profile updated!");
        navigate("/dashboard");
      } else {
        setMessage(data.message || "Failed to update profile");
      }
    } catch (err) {
      setMessage("Error updating profile.");
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
      const res = await fetch("http://localhost:8070/api/dashboard/delete", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        alert("Profile deleted successfully");
        handleLogout();
      } else {
        const data = await res.json();
        alert(data.message || "Failed to delete profile");
      }
    } catch {
      alert("Error deleting profile");
    }
  };

  return (
    <>
      <Navbar />

      <div className="update-profile-wrapper">
        <div className="update-header">
        </div>

        <form onSubmit={handleSubmit} className="update-form">
          <h2>Update Your Profile</h2>
          {message && <p className="error">{message}</p>}
          <label>
            First Name:
            <input
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Last Name:
            <input
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Email:
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>

          <div className="button-group">
            <button type="submit" className="update-btn">Update Profile</button>
            <button type="button" className="cancel-btn" onClick={() => navigate("/dashboard")}>
              Cancel
            </button>
          </div>
        </form>
      </div>

      <Footer />
    </>
  );
};

export default UpdateBuyerProfile;