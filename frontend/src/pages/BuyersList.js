// src/pages/BuyersList.js
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./BuyersList.css"; // Import the CSS file

function BuyersList() {
  const [buyers, setBuyers] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // If no token, redirect to login page
      navigate("/api/auth/login");
    } else {
      fetchBuyers(token);
    }
    // eslint-disable-next-line
  }, [navigate]);

  // Fetch all users, then filter out buyers
  const fetchBuyers = async (token) => {
    try {
      const res = await fetch("http://localhost:8070/users", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        // data is expected to be an object: { users: [...] }
        const buyersList = data.users.filter((user) => user.role === "buyer");
        // Optional: sort by createdAt descending
        const sortedBuyers = buyersList.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setBuyers(sortedBuyers);
      } else {
        setMessage(data.message || "Error fetching buyers");
      }
    } catch (err) {
      console.error("Error fetching buyers:", err);
      setMessage("Error fetching buyers");
    }
  };

  // Navigate back to the superadmin dashboard
  const handleBack = () => {
    navigate("/superadmin");
  };

  // Navigate to the Add Buyer page
  const handleAddBuyer = () => {
    navigate("/superadmin/add-buyer");
  };

  // Navigate to the Update Buyer form
  const handleUpdate = (buyerId) => {
    navigate(`/superadmin/update-buyer/${buyerId}`);
  };

  // Delete a buyer
  const handleDelete = async (buyerId) => {
    if (!window.confirm("Are you sure you want to delete this buyer?")) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:8070/users/${buyerId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        alert("Buyer deleted successfully");
        // Refresh buyers list
        fetchBuyers(token);
      } else {
        alert(data.message || "Failed to delete buyer");
      }
    } catch (error) {
      console.error("Error deleting buyer:", error);
      alert("Error deleting buyer");
    }
  };

  return (
    <div className="buyers-container">
      <div className="buyers-header">
        <button onClick={handleBack} className="back-button">
          Back
        </button>
        <h2>All Buyers</h2>
        <button onClick={handleAddBuyer} className="add-buyer-button">
          Add Buyer
        </button>
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
                  <button
                    onClick={() => handleUpdate(buyer._id)}
                    className="edit-button"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(buyer._id)}
                    className="delete-button"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No buyers found.</p>
      )}
    </div>
  );
}

export default BuyersList;