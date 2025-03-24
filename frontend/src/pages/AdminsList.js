// src/pages/AdminsList.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminsList.css";

function AdminsList() {
  const [admins, setAdmins] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token"); // Make sure this is the correct key for your token
    if (!token) {
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
          Authorization: `Bearer ${token}`, // If using JWT
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

  const handleUpdate = (adminId) => {
    navigate(`/superadmin/update-admin/${adminId}`);
  };

  const handleDelete = async (adminId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("No token found. Please login.");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this admin?")) {
      return;
    }
    try {
      const res = await fetch(`http://localhost:8070/api/admins/${adminId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // If using JWT
        },
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Admin deleted successfully");
        // Re-fetch the admins list
        fetchAdmins(token);
      } else {
        setMessage(data.message || "Error deleting admin");
      }
    } catch (err) {
      console.error("Error deleting admin:", err);
      setMessage("Error deleting admin");
    }
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
              <th>Full Name</th>
              <th>Admin Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin._id}>
                <td>{admin.email}</td>
                <td>{admin.firstName} {admin.lastName}</td>
                <td>{admin.adminType}</td>
                <td>
                  <button onClick={() => handleUpdate(admin._id)}>Update</button>
                  <button onClick={() => handleDelete(admin._id)}>Delete</button>
                </td>
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