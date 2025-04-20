// src/pages/SuperAdminDashboard.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SuperAdminDashboard.css";
import SuperAdminSidebar from "../components/SuperAdminSidebar";
import { FaEdit, FaTrash } from "react-icons/fa";

function SuperAdminDashboard() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [adminCount, setAdminCount] = useState(0);
  const [sellerCount, setSellerCount] = useState(0);
  const [buyerCount, setBuyerCount] = useState(0);
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchCounts(token);
    fetchUsers(token);
  }, [navigate]);

  const fetchCounts = async (token) => {
    try {
      const res = await fetch("http://localhost:8070/api/dashboard/superadmin/stats", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setAdminCount(data.adminCount || 0);
      setSellerCount(data.sellerCount || 0);
      setBuyerCount(data.buyerCount || 0);
    } catch (error) {
      console.error("Count fetch error:", error);
    }
  };

  const fetchUsers = async (token) => {
    try {
      const [adminRes, sellerRes, buyerRes] = await Promise.all([
        fetch("http://localhost:8070/api/admins", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://localhost:8070/api/sellers", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://localhost:8070/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const [admins, sellers, users] = await Promise.all([
        adminRes.json(),
        sellerRes.json(),
        buyerRes.json(),
      ]);

      const buyers = users.filter((u) => u.role === "buyer");
      const combined = [
        ...admins.map((a) => ({ ...a, role: "admin" })),
        ...sellers.map((s) => ({ ...s, role: "seller" })),
        ...buyers.map((b) => ({ ...b, role: "buyer" })),
      ];

      setAllUsers(combined);
      setFilteredUsers(combined);
    } catch (error) {
      console.error("User fetch error:", error);
    }
  };

  const handleSearch = () => {
    const query = searchTerm.toLowerCase().trim();
    if (!query) {
      setFilteredUsers(allUsers);
      return;
    }
    const results = allUsers.filter((user) => {
      const fullName = user.firstName && user.lastName
        ? `${user.firstName} ${user.lastName}`.toLowerCase()
        : user.name?.toLowerCase() || "";
      const email = user.email?.toLowerCase() || "";
      return fullName.includes(query) || email.includes(query);
    });
    setFilteredUsers(results);
  };

  return (
    <div className="superadmin-layout">
      <SuperAdminSidebar />
      <main className="superadmin-main">
        <header>
          <h2>Super Admin Dashboard</h2>
        </header>

        {/* Search */}
        <section className="search-bar">
          <input
            type="text"
            placeholder="Search by name or email..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="search-btn" onClick={handleSearch}>
            🔍 Search
          </button>
        </section>

        {/* Stats */}
        <section className="dashboard-stats">
          <div className="card">
            <h4>Total Admins</h4>
            <p>{adminCount}</p>
          </div>
          <div className="card">
            <h4>Total Sellers</h4>
            <p>{sellerCount}</p>
          </div>
          <div className="card">
            <h4>Total Buyers</h4>
            <p>{buyerCount}</p>
          </div>
        </section>

        {/* Table */}
        <section className="search-results">
          {filteredUsers.length > 0 ? (
            <table className="result-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id}>
                    <td>{user.firstName ? `${user.firstName} ${user.lastName}` : user.name || "-"}</td>
                    <td>{user.email || "-"}</td>
                    <td>{user.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No matching users found.</p>
          )}
        </section>

        {/* Actions */}
        <section className="actions">
          <button
            className="profile-btn"
            onClick={() => alert("Update profile logic here")}
          >
            <FaEdit /> Update Profile
          </button>
          <button
            className="profile-btn delete"
            onClick={() => alert("Delete profile logic here")}
          >
            <FaTrash /> Delete Profile
          </button>
        </section>
      </main>
    </div>
  );
}

export default SuperAdminDashboard;
