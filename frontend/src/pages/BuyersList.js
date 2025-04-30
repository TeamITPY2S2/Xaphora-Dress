// src/pages/BuyersList.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SuperAdminSidebar from "../components/SuperAdminSidebar";
import { FaDownload, FaSearch, FaPlus } from "react-icons/fa";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import "../styles/ListStyles.css";

function BuyersList() {
  const [buyers, setBuyers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/api/auth/login");
    fetchBuyers(token);
  }, [navigate]);

  const fetchBuyers = async (token) => {
    try {
      const res = await fetch("http://localhost:8070/api/users", {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error");
      const list = Array.isArray(data) ? data : data.users || [];
      const onlyBuyers = list
        .filter(u => u.role === "buyer")
        .sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
      setBuyers(onlyBuyers);
      setFiltered(onlyBuyers);
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Error fetching buyers");
    }
  };

  useEffect(() => {
    const q = searchTerm.trim().toLowerCase();
    setFiltered(
      !q
        ? buyers
        : buyers.filter(b =>
            [b.email, `${b.firstName} ${b.lastName}`]
              .join(" ")
              .toLowerCase()
              .includes(q)
          )
    );
  }, [searchTerm, buyers]);

  const handleAdd = () => navigate("/superadmin/add-buyer");
  const handleUpdate = id => navigate(`/superadmin/update-buyer/${id}`);
  const handleDelete = async id => {
    if (!window.confirm("Are you sure you want to delete this buyer?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8070/api/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to delete");
      setBuyers(buyers.filter(b => b._id !== id));
      setFiltered(filtered.filter(b => b._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete buyer");
    }
  };

  const handleDownloadPdf = () => {
    const doc = new jsPDF();
    doc.text("Buyers List", 14, 15);
    
    const tableData = filtered.map(b => [
      b.email,
      `${b.firstName} ${b.lastName}`,
      new Date(b.createdAt).toLocaleDateString()
    ]);

    autoTable(doc, {
      head: [["Email", "Full Name", "Created At"]],
      body: tableData,
      startY: 25
    });

    doc.save("buyers-list.pdf");
  };

  return (
    <div className="superadmin-layout">
      <SuperAdminSidebar />
      <main className="list-container">
        <div className="list-header">
          <h1 className="list-title">Buyer Management</h1>
          <div className="list-actions">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search buyers..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="add-button" onClick={handleAdd}>
              <FaPlus /> Add Buyer
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
                <div className="table-cell">Created At</div>
                <div className="table-cell">Actions</div>
              </div>
            </div>
            {filtered.map(b => (
              <div key={b._id} className="table-row">
                <div className="table-cell">{b.email}</div>
                <div className="table-cell">{`${b.firstName} ${b.lastName}`}</div>
                <div className="table-cell">{new Date(b.createdAt).toLocaleString()}</div>
                <div className="table-cell">
                  <div className="action-buttons">
                    <button className="action-button edit-button" onClick={() => handleUpdate(b._id)}>
                      Update
                    </button>
                    <button className="action-button delete-button" onClick={() => handleDelete(b._id)}>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>No Buyers Found</h3>
            <p>There are no buyers in the system yet.</p>
            <button className="add-button" onClick={handleAdd}>
              <FaPlus /> Add First Buyer
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default BuyersList;