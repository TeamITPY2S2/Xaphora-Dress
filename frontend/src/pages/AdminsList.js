// src/pages/AdminsList.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SuperAdminSidebar from "../components/SuperAdminSidebar";
import { FaDownload, FaSearch, FaPlus } from "react-icons/fa";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import "../styles/ListStyles.css";

export default function AdminsList() {
  const [admins, setAdmins] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Load admins on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/api/auth/login");
    fetchAdmins(token);
  }, [navigate]);

  // Fetch + sort
  const fetchAdmins = async (token) => {
    try {
      const res = await fetch("http://localhost:8070/api/admins", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error fetching admins");
      
      // super-admins first, then newest
      const sorted = data.sort((a, b) => {
        if (a.adminType === "super-admin" && b.adminType !== "super-admin") return -1;
        if (b.adminType === "super-admin" && a.adminType !== "super-admin") return 1;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      setAdmins(sorted);
      setFiltered(sorted);
    } catch (err) {
      console.error(err);
      setMessage(err.message);
    }
  };

  // Live filtering
  useEffect(() => {
    const q = searchTerm.trim().toLowerCase();
    setFiltered(
      !q
        ? admins
        : admins.filter(a =>
            [a.email, `${a.firstName} ${a.lastName}`, a.adminType]
              .join(" ")
              .toLowerCase()
              .includes(q)
          )
    );
  }, [searchTerm, admins]);

  // Navigation handlers
  const handleAdd = () => navigate("/superadmin/add-admin");
  const handleUpdate = id => navigate(`/superadmin/update-admin/${id}`);
  const handleDelete = async id => {
    if (!window.confirm("Are you sure you want to delete this admin?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8070/api/admins/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Delete failed");
      // remove locally
      setAdmins(admins.filter(a => a._id !== id));
      setFiltered(filtered.filter(a => a._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete admin");
    }
  };

  // PDF export
  const handleDownloadPdf = () => {
    const doc = new jsPDF();
    doc.text("Admins List", 14, 15);
    const rows = filtered.map(a => [
      a.email,
      `${a.firstName} ${a.lastName}`,
      a.adminType,
      new Date(a.createdAt).toLocaleDateString()
    ]);
    autoTable(doc, {
      head: [["Email", "Full Name", "Admin Type", "Created At"]],
      body: rows,
      startY: 25
    });
    doc.save("admins-list.pdf");
  };

  return (
    <div className="superadmin-layout">
      <SuperAdminSidebar />

      <main className="list-container">
        <div className="list-header">
          <h1 className="list-title">Admin Management</h1>
          <div className="list-actions">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search admins..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="add-button" onClick={handleAdd}>
              <FaPlus /> Add Admin
            </button>
            <button className="add-button" onClick={handleDownloadPdf}>
              <FaDownload /> Download PDF
            </button>
          </div>
        </div>

        {message && <div className="alert alert-info">{message}</div>}

        {filtered.length > 0 ? (
          <div className="list-table">
            <div className="table-header">
              <div className="table-row">
                <div className="table-cell">Email</div>
                <div className="table-cell">Full Name</div>
                <div className="table-cell">Admin Type</div>
                <div className="table-cell">Created At</div>
                <div className="table-cell">Actions</div>
              </div>
            </div>
            {filtered.map(a => (
              <div key={a._id} className="table-row">
                <div className="table-cell">{a.email}</div>
                <div className="table-cell">{`${a.firstName} ${a.lastName}`}</div>
                <div className="table-cell">{a.adminType}</div>
                <div className="table-cell">{new Date(a.createdAt).toLocaleString()}</div>
                <div className="table-cell">
                  <div className="action-buttons">
                    <button className="action-button edit-button" onClick={() => handleUpdate(a._id)}>
                      Update
                    </button>
                    <button className="action-button delete-button" onClick={() => handleDelete(a._id)}>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>No Admins Found</h3>
            <p>There are no admins in the system yet.</p>
            <button className="add-button" onClick={handleAdd}>
              <FaPlus /> Add First Admin
            </button>
          </div>
        )}
      </main>
    </div>
  );
}