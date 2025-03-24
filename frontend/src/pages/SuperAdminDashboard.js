// src/pages/SuperAdminDashboard.js
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./SuperAdminDashboard.css";

function SuperAdminDashboard() {
  const [specialData, setSpecialData] = useState("");  // e.g., fetched from your backend
  const [admins, setAdmins] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [buyers, setBuyers] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchSpecialData(token);
  }, [navigate]);

  const fetchSpecialData = async (token) => {
    try {
      const res = await fetch("http://localhost:8070/api/superadmin/data", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setSpecialData(data.specialData || "No special data");
      } else {
        setMessage(data.message || "Error fetching special data");
      }
    } catch (err) {
      console.error("Error fetching special data:", err);
      setMessage("Error fetching special data");
    }
  };

  const handleGetAdmins = async () => {
    setMessage("");
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:8070/api/admins", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setAdmins(data);
        setSellers([]);
        setBuyers([]);
      } else {
        setMessage(data.message || "Error fetching admins");
      }
    } catch (err) {
      console.error("Error fetching admins:", err);
      setMessage("Error fetching admins");
    }
  };

  const handleGetSellers = async () => {
    setMessage("");
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:8070/api/sellers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setSellers(data);
        setAdmins([]);
        setBuyers([]);
      } else {
        setMessage(data.message || "Error fetching sellers");
      }
    } catch (err) {
      console.error("Error fetching sellers:", err);
      setMessage("Error fetching sellers");
    }
  };

  const handleGetBuyers = async () => {
    setMessage("");
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:8070/api/buyers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setBuyers(data);
        setAdmins([]);
        setSellers([]);
      } else {
        setMessage(data.message || "Error fetching buyers");
      }
    } catch (err) {
      console.error("Error fetching buyers:", err);
      setMessage("Error fetching buyers");
    }
  };

  const handleUpdateProfile = () => {
    // Implement update profile logic
    alert("Update profile logic here");
  };

  const handleDeleteProfile = () => {
    // Implement delete profile logic
    alert("Delete profile logic here");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    navigate("/api/auth/login");
  };

  return (
    <div className="superadmin-container">
      <h2 className="superadmin-title">Super Admin Dashboard</h2>
      <p>Welcome, Super admin!</p>
      {message && <p className="superadmin-message">{message}</p>}
      <p>Special data: {specialData}</p>

      <div className="top-buttons">
        <button onClick={handleGetAdmins}>Admins</button>
        <button onClick={handleGetSellers}>Sellers</button>
        <button onClick={handleGetBuyers}>Buyers</button>
      </div>

      {/* Display Admins */}
      {admins.length > 0 && (
        <div className="data-table">
          <h3>Admins</h3>
          <table>
            <thead>
              <tr>
                <th>Email</th>
                <th>Admin Type</th>
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
        </div>
      )}

      {/* Display Sellers */}
      {sellers.length > 0 && (
        <div className="data-table">
          <h3>Sellers</h3>
          <table>
            <thead>
              <tr>
                <th>Email</th>
                <th>First Name</th>
                <th>Last Name</th>
              </tr>
            </thead>
            <tbody>
              {sellers.map((seller) => (
                <tr key={seller._id}>
                  <td>{seller.email}</td>
                  <td>{seller.firstName}</td>
                  <td>{seller.lastName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Display Buyers */}
      {buyers.length > 0 && (
        <div className="data-table">
          <h3>Buyers</h3>
          <table>
            <thead>
              <tr>
                <th>Email</th>
                <th>First Name</th>
                <th>Last Name</th>
              </tr>
            </thead>
            <tbody>
              {buyers.map((buyer) => (
                <tr key={buyer._id}>
                  <td>{buyer.email}</td>
                  <td>{buyer.firstName}</td>
                  <td>{buyer.lastName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="bottom-right-buttons">
        <button onClick={handleUpdateProfile} className="update-profile-button">
          Update Profile
        </button>
        <button onClick={handleDeleteProfile} className="delete-profile-button">
          Delete Profile
        </button>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}

export default SuperAdminDashboard;