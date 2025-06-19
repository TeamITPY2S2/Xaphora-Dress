// src/pages/SellersList.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SuperAdminSidebar from "../components/SuperAdminSidebar";
import { FaDownload, FaSearch, FaPlus } from "react-icons/fa";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import "../styles/ListStyles.css";

function SellersList() {
  const [sellers, setSellers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // load on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/api/auth/login");
    fetchSellers(token);
  }, [navigate]);

  const fetchSellers = async (token) => {
    try {
      const res = await fetch("http://localhost:8070/api/sellers", {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error");
      const sorted = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setSellers(sorted);
      setFiltered(sorted);
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Error fetching sellers");
    }
  };

  // live filter
  useEffect(() => {
    const q = searchTerm.trim().toLowerCase();
    setFiltered(
      !q
        ? sellers
        : sellers.filter(s =>
            [s.email, s.name, s.storeName]
              .join(" ")
              .toLowerCase()
              .includes(q)
          )
    );
  }, [searchTerm, sellers]);

  const handleAdd = () => navigate("/superadmin/add-seller");
  const handleUpdate = id => navigate(`/superadmin/update-seller/${id}`);
  const handleDelete = async id => {
    if (!window.confirm("Are you sure you want to delete this seller?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8070/api/sellers/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to delete");
      setSellers(sellers.filter(s => s._id !== id));
      setFiltered(filtered.filter(s => s._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete seller");
    }
  };

  const handleDownloadPdf = () => {
    const doc = new jsPDF();
    doc.text("Sellers List", 14, 15);
    
    const tableData = filtered.map(s => [
      s.email,
      s.name,
      s.storeName,
      new Date(s.createdAt).toLocaleDateString()
    ]);

    autoTable(doc, {
      head: [["Email", "Name", "Store", "Created At"]],
      body: tableData,
      startY: 25
    });

    doc.save("sellers-list.pdf");
  };

  return (
    <div className="superadmin-layout">
      <SuperAdminSidebar />
      <main className="list-container">
        <div className="list-header">
          <h1 className="list-title">Seller Management</h1>
          <div className="list-actions">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search sellers..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="add-button" onClick={handleAdd}>
              <FaPlus /> Add Seller
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
                <div className="table-cell">Name</div>
                <div className="table-cell">Store</div>
                <div className="table-cell">Actions</div>
              </div>
            </div>
            {filtered.map(s => (
              <div key={s._id} className="table-row">
                <div className="table-cell">{s.email}</div>
                <div className="table-cell">{s.name}</div>
                <div className="table-cell">{s.storeName}</div>
                <div className="table-cell">
                  <div className="action-buttons">
                    <button className="action-button edit-button" onClick={() => handleUpdate(s._id)}>
                      Update
                    </button>
                    <button className="action-button delete-button" onClick={() => handleDelete(s._id)}>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>No Sellers Found</h3>
            <p>There are no sellers in the system yet.</p>
            <button className="add-button" onClick={handleAdd}>
              <FaPlus /> Add First Seller
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default SellersList;