// src/pages/UpdateBuyerProfile.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UpdateBuyerProfile.css";

const UpdateBuyerProfile = () => {
  const navigate = useNavigate();
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

  return (
    <div className="update-profile-container">
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
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default UpdateBuyerProfile;