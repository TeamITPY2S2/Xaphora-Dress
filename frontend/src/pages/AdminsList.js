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
    fetchAdmins(token);
  }, [navigate]);

  const fetchAdmins = async (token) => {
    try {
      const res = await fetch("http://localhost:8070/api/admins", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        // Sort: super-admins first, then descending by createdAt
        const sorted = data.sort((a, b) => {
          if (a.adminType === "super-admin" && b.adminType !== "super-admin") {
            return -1;
          }
          if (b.adminType === "super-admin" && a.adminType !== "super-admin") {
            return 1;
          }
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        setAdmins(sorted);
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
    if (!window.confirm("Are you sure you want to delete this admin?")) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:8070/api/admins/${adminId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        alert("Admin deleted successfully");
        fetchAdmins(token); // Refresh list
      } else {
        alert(data.message || "Failed to delete admin");
      }
    } catch (error) {
      console.error("Error deleting admin:", error);
      alert("Error deleting admin");
    }
  };

  return (
    <div className="admins-container">
      <div className="admins-header">
        <button onClick={handleBack} className="back-button">Back</button>
        <h2>All Admins</h2>
        <button onClick={handleAddAdmin} className="add-admin-button">Add Admin</button>
      </div>

      {message && <p style={{ color: "red" }}>{message}</p>}

      {admins.length > 0 ? (
        <table className="admins-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Full Name</th>
              <th>Admin Type</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin._id}>
                <td>{admin.email}</td>
                <td>{`${admin.firstName} ${admin.lastName}`}</td>
                <td>{admin.adminType}</td>
                <td>{new Date(admin.createdAt).toLocaleString()}</td>
                <td>
                  <button onClick={() => handleUpdate(admin._id)} className="edit-button">
                    Update
                  </button>
                  <button onClick={() => handleDelete(admin._id)} className="delete-button">
                    Delete
                  </button>
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