// src/pages/SuperAdminDashboard.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SuperAdminDashboard.css";
import SuperAdminSidebar from "../components/SuperAdminSidebar";
import { FaEdit, FaTrash, FaDownload } from "react-icons/fa";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

function SuperAdminDashboard() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm]       = useState("");
  const [adminCount, setAdminCount]       = useState(0);
  const [sellerCount, setSellerCount]     = useState(0);
  const [buyerCount, setBuyerCount]       = useState(0);
  const [allUsers, setAllUsers]           = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/api/auth/login");
      return;
    }
    fetchCounts(token);
    fetchUsers(token);
  }, [navigate]);

  // fetch stats
  async function fetchCounts(token) {
    try {
      const res = await fetch(
        "http://localhost:8070/api/dashboard/superadmin/stats",
        { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      setAdminCount(data.adminCount || 0);
      setSellerCount(data.sellerCount || 0);
      setBuyerCount(data.buyerCount || 0);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  }

  // fetch and combine
  async function fetchUsers(token) {
    try {
      const [adminsRes, sellersRes, buyersRes] = await Promise.all([
        fetch("http://localhost:8070/api/admins",  { headers: { Authorization: `Bearer ${token}` } }),
        fetch("http://localhost:8070/api/sellers", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("http://localhost:8070/api/users",   { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const [adminsPayload, sellersPayload, buyersPayload] = await Promise.all([
        adminsRes.json(), sellersRes.json(), buyersRes.json()
      ]);

      const adminsList  = Array.isArray(adminsPayload)  ? adminsPayload  : adminsPayload.admins  || [];
      const sellersList = Array.isArray(sellersPayload) ? sellersPayload : sellersPayload.sellers || [];
      const buyersList  = Array.isArray(buyersPayload)  ? buyersPayload  : buyersPayload.users   || [];

      const onlyBuyers = buyersList.filter(u => u.role === "buyer");

      const combined = [
        ...adminsList .map(a => ({ ...a, role: "admin"  })),
        ...sellersList.map(s => ({ ...s, role: "seller" })),
        ...onlyBuyers .map(b => ({ ...b, role: "buyer"  })),
      ];

      combined.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
      setAllUsers(combined);
      setFilteredUsers(combined);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  }

  // live search
  useEffect(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return setFilteredUsers(allUsers);

    setFilteredUsers(allUsers.filter(u => {
      const name = u.firstName
        ? `${u.firstName} ${u.lastName}`.toLowerCase()
        : (u.name || "").toLowerCase();
      const email = (u.email || "").toLowerCase();
      return name.includes(q) || email.includes(q);
    }));
  }, [searchTerm, allUsers]);

  // PDF export
  const handleDownloadPdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("All Users", 14, 22);

    const head = [["Name", "Email", "Role", "Created At"]];
    const body = filteredUsers.map(u => [
      u.firstName ? `${u.firstName} ${u.lastName}` : (u.name || "-"),
      u.email || "-",
      u.role,
      new Date(u.createdAt).toLocaleString()
    ]);

    autoTable(doc, {
      head,
      body,
      startY: 28,
      headStyles: { fillColor: [243,244,246], textColor: [107,114,128], fontStyle: "bold" },
      styles: { fontSize: 10 }
    });

    doc.save("all_users.pdf");
  };

  return (
    <div className="superadmin-layout">
      <SuperAdminSidebar />
      <main className="superadmin-main">
        {/* Header */}
        <header className="dashboard-header">
          <h2>Super Admin Dashboard</h2>

          <div className="header-actions">
            <input
              type="text"
              className="search-input"
              placeholder="Search by name or email…"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />

            <button className="download-pdf-btn" onClick={handleDownloadPdf}>
              <FaDownload /> Download PDF
            </button>
          </div>
        </header>

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
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(u => (
                  <tr key={u._id}>
                    <td>
                      {u.firstName
                        ? `${u.firstName} ${u.lastName}`
                        : u.name || "-"}
                    </td>
                    <td>{u.email || "-"}</td>
                    <td>{u.role}</td>
                    <td>{new Date(u.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="no-results">No matching users found.</p>
          )}
        </section>

        {/* Profile Actions */}
        <section className="actions">
          <button className="profile-btn">
            <FaEdit /> Update Profile
          </button>
          <button className="profile-btn delete">
            <FaTrash /> Delete Profile
          </button>
        </section>
      </main>
    </div>
  );
}

export default SuperAdminDashboard;