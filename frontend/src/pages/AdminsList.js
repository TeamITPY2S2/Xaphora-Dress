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
      navigate("/login");
      return;
    }
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
        fetchAdmins(token);
      } else {
        alert(data.message || "Failed to delete admin");
      }
    } catch (error) {
      console.error("Error deleting admin:", error);
      alert("Error deleting admin");
    }
  };

  return (
    <div className="container-fluid p-4">
      <div className="row mb-3">
        <div className="col-12 d-flex justify-content-between align-items-center">
          <button 
            className="btn-back" 
            onClick={handleBack}
          >
            Back
          </button>
          <h2 className="text-center mb-0">All Admins</h2>
          <button 
            className="btn-add" 
            onClick={handleAddAdmin}
          >
            Add Admin
          </button>
        </div>
      </div>

      {message && (
        <div className="alert alert-danger" role="alert">
          {message}
        </div>
      )}

      <div className="row">
        <div className="col-12">
          {admins.length > 0 ? (
            <table className="table table-striped table-hover shadow-sm">
              <thead className="table-light">
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
                    <td className="action-buttons">
                      <button 
                        className="btn-update" 
                        onClick={() => handleUpdate(admin._id)}
                      >
                        Update
                      </button>
                      <button 
                        className="btn-delete" 
                        onClick={() => handleDelete(admin._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="alert alert-info" role="alert">
              No admins found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminsList;