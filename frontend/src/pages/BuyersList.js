import React, { useEffect, useState } from "react";

import { useNavigate, useLocation, Link } from "react-router-dom";
import SuperAdminSidebar from "../components/SuperAdminSidebar";
import "./BuyersList.css";
//import { useNavigate, Link } from "react-router-dom";


function BuyersList() {
  const [buyers, setBuyers] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {


      navigate("/api/auth/login");
    } else {
      fetchBuyers(token);
    }

  }, [navigate]);

  // Fetch all users

  const fetchBuyers = async (token) => {
    try {
      const res = await fetch("http://localhost:8070/api/users", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
//<<<<<<< frontend/admin-dashboards
      if (res.ok && Array.isArray(data)) {
        const buyersOnly = data.filter((u) => u.role === "buyer");
        setBuyers(buyersOnly);
      } else if (res.ok && data.users) {
        const buyersOnly = data.users.filter((u) => u.role === "buyer");
        setBuyers(buyersOnly);
// =======
//       if (res.ok) {
        
//         const buyersList = data.users.filter((user) => user.role === "buyer");
//         // sort by created descending order
//         const sortedBuyers = buyersList.sort(
//           (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
//         );
//         setBuyers(sortedBuyers);
// >>>>>>> dev
      } else {
        setMessage(data.message || "Error fetching buyers");
      }
    } catch (err) {
      console.error("Error fetching buyers:", err);
      setMessage("Error fetching buyers");
    }
  };

  const handleBack = () => navigate("/superadmin");
  const handleAddBuyer = () => navigate("/superadmin/add-buyer");

  const handleUpdate = (id) => navigate(`/superadmin/update-buyer/${id}`);
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this buyer?")) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:8070/api/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        alert("Buyer deleted successfully");

        fetchBuyers(token);
      } else {
        alert(data.message || "Failed to delete buyer");
      }
    } catch (error) {
      alert("Error deleting buyer");
    }
  };

  return (
    <div className="superadmin-layout">
      <SuperAdminSidebar />

      <main className="superadmin-main">
        <div className="buyers-header">
          <h2>All Buyers</h2>
          <button onClick={handleAddBuyer} className="add-buyer-button">Add Buyer</button>
        </div>

        {message && <p style={{ color: "red" }}>{message}</p>}

        {buyers.length > 0 ? (
          <table className="buyers-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Full Name</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {buyers.map((buyer) => (
                <tr key={buyer._id}>
                  <td>{buyer.email}</td>
                  <td>{`${buyer.firstName} ${buyer.lastName}`}</td>
                  <td>{new Date(buyer.createdAt).toLocaleString()}</td>
                  <td>
                    <button onClick={() => handleUpdate(buyer._id)} className="edit-button">Update</button>
                    <button onClick={() => handleDelete(buyer._id)} className="delete-button">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No buyers found.</p>
        )}
      </main>
    </div>
  );
}

export default BuyersList;