// src/pages/AdminsList.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminsList.css";

function AdminsList() {
  const [admins, setAdmins] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // If your route requires a token, show error or redirect
      setMessage("No token found. Please login.");
      return;
    }
    fetchAdmins(token);
  }, [navigate]);

  const fetchAdmins = async (token) => {
    try {
      const res = await fetch("http://localhost:8070/api/admins", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
      });
      const data = await res.json();
      if (res.ok) {
        setAdmins(data);
      } else {
        setMessage(data.message || "Error fetching admins");
      }
    } catch (err) {
      console.error("Error fetching admins:", err);
      setMessage("Error fetching admins");
    }
  };

  const handleBack = () => {
    navigate("/superadmin");
  };

  const handleAddAdmin = () => {
    navigate("/superadmin/add-admin");
  };

  return (
    <div className="admins-container">
      <div className="admins-header">
        <button onClick={handleBack} className="back-button">BACK</button>
        <h2>All Admins</h2>
        <button onClick={handleAddAdmin} className="add-admin-button">ADD ADMIN</button>
      </div>

      {message && <p style={{ color: "red" }}>{message}</p>}

      {admins.length > 0 ? (
        <table className="admins-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Admin Type</th>
              {/* Add more columns if needed */}
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin._id}>
                <td>{admin.email}</td>
                <td>{admin.adminType}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No admins found.</p>
      )}
    </div>
  );
}

export default AdminsList;