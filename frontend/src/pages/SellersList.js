// src/pages/SellersList.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SellersList.css";

function SellersList() {
  const [sellers, setSellers] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/api/auth/login");
    } else {
      fetchSellers(token);
    }
    // eslint-disable-next-line
  }, [navigate]);

  const fetchSellers = async (token) => {
    try {
      const res = await fetch("http://localhost:8070/api/sellers", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        // data should be an array of sellers
        setSellers(data);
      } else {
        setMessage(data.message || "Error fetching sellers");
      }
    } catch (error) {
      console.error("Error fetching sellers:", error);
      setMessage("Error fetching sellers");
    }
  };

  const handleBack = () => {
    navigate("/superadmin");
  };

  const handleAddSeller = () => {
    navigate("/superadmin/add-seller");
  };

  const handleUpdate = (sellerId) => {
    navigate(`/superadmin/update-seller/${sellerId}`);
  };

  const handleDelete = async (sellerId) => {
    if (!window.confirm("Are you sure you want to delete this seller?")) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:8070/api/sellers/${sellerId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        alert("Seller deleted successfully");
        fetchSellers(token); // Refresh the list
      } else {
        alert(data.message || "Failed to delete seller");
      }
    } catch (error) {
      console.error("Error deleting seller:", error);
      alert("Error deleting seller");
    }
  };

  return (
    <div className="sellers-container">
      <div className="sellers-header">
        <button onClick={handleBack} className="back-button">
          Back
        </button>
        <h2>All Sellers</h2>
        <button onClick={handleAddSeller} className="add-seller-button">
          Add Seller
        </button>
      </div>

      {message && <p style={{ color: "red" }}>{message}</p>}

      {sellers.length > 0 ? (
        <table className="sellers-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Name</th>
              <th>Store Name</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sellers.map((seller) => (
              <tr key={seller._id}>
                <td>{seller.email}</td>
                <td>{seller.name}</td>
                <td>{seller.storeName}</td>
                <td>{new Date(seller.createdAt).toLocaleString()}</td>
                <td>
                  <button
                    onClick={() => handleUpdate(seller._id)}
                    className="edit-button"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(seller._id)}
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
        <p>No sellers found.</p>
      )}
    </div>
  );
}

export default SellersList;