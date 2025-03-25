// src/pages/UpdateAdmin.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./UpdateAdmin.css";

function UpdateAdmin() {
  const { adminId } = useParams();
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    adminType: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchAdmin();
    // eslint-disable-next-line
  }, []);

  const fetchAdmin = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("No token found. Please login.");
      return;
    }
    try {
      const res = await fetch(`http://localhost:8070/api/admins/${adminId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setAdminData({
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          adminType: data.adminType || "",
        });
      } else {
        setMessage(data.message || "Error fetching admin");
      }
    } catch (err) {
      console.error("Error fetching admin:", err);
      setMessage("Error fetching admin");
    }
  };

  const handleChange = (e) => {
    setAdminData({ ...adminData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("No token found. Please login.");
      return;
    }
    try {
      const res = await fetch(`http://localhost:8070/api/admins/${adminId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(adminData),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Admin updated successfully!");
        navigate("/superadmin/admins");
      } else {
        setMessage(data.message || "Error updating admin");
      }
    } catch (err) {
      console.error("Error updating admin:", err);
      setMessage("Error updating admin");
    }
  };

  const handleBack = () => {
    navigate("/superadmin/admins");
  };

  return (
    <div className="update-admin-container">
      <h2>Update Admin</h2>
      {message && <p className="error-message">{message}</p>}

      <form onSubmit={handleUpdate} className="update-form">
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={adminData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>First Name:</label>
          <input
            type="text"
            name="firstName"
            value={adminData.firstName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Last Name:</label>
          <input
            type="text"
            name="lastName"
            value={adminData.lastName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Admin Type:</label>
          <select
            name="adminType"
            value={adminData.adminType}
            onChange={handleChange}
            required
          >
            <option value="">Select Admin Type</option>
            <option value="super-admin">Super Admin</option>
            <option value="delivery">Delivery</option>
            <option value="inventory">Inventory</option>
            <option value="order-management">Order Management</option>
            <option value="reviews">Reviews</option>
          </select>
        </div>

        <div className="button-group">
          <button type="submit" className="update-button">Update</button>
          <button type="button" className="back-button" onClick={handleBack}>
            Back
          </button>
        </div>
      </form>
    </div>
  );
}

export default UpdateAdmin;