// src/pages/SellersList.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SuperAdminSidebar from "../components/SuperAdminSidebar";
import "./SellersList.css";

function SellersList() {
  const [sellers, setSellers] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/api/auth/login");
      return;
    }
    fetchSellers(token);
  }, [navigate]);

  const fetchSellers = async (token) => {
    try {
      const res = await fetch("http://localhost:8070/api/sellers", {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setSellers(data);
      } else {
        setMessage(data.message || "Error fetching sellers");
      }
    } catch {
      setMessage("Error fetching sellers");
    }
  };

  const handleBack = () => navigate("/superadmin");
  const handleAdd = () => navigate("/superadmin/add-seller");
  const handleUpdate = id => navigate(`/superadmin/update-seller/${id}`);
  const handleDelete = async id => {
    if (!window.confirm("Are you sure?")) return;
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:8070/api/sellers/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const { message: msg } = await res.json();
    if (res.ok) fetchSellers(token);
    else alert(msg || "Failed to delete");
  };

  return (
    <div className="superadmin-layout">
      <SuperAdminSidebar />
      <main className="superadmin-main">
        <div className="sellers-header">
          <h2>All Sellers</h2>
          <button onClick={handleAdd} className="add-seller-button">Add Seller</button>
        </div>

        {message && <p className="error-text">{message}</p>}

        {sellers.length > 0 ? (
          <table className="sellers-table">
            <thead>
              <tr>
                <th>Email</th><th>Name</th><th>Store</th><th>Created At</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sellers.map(s => (
                <tr key={s._id}>
                  <td>{s.email}</td>
                  <td>{s.name}</td>
                  <td>{s.storeName}</td>
                  <td>{new Date(s.createdAt).toLocaleString()}</td>
                  <td className="action-buttons">
                    <button onClick={() => handleUpdate(s._id)} className="edit-button">Update</button>
                    <button onClick={() => handleDelete(s._id)} className="delete-button">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No sellers found.</p>
        )}
      </main>
    </div>
  );
}

export default SellersList;