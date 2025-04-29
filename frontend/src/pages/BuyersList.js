// src/pages/BuyersList.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SuperAdminSidebar from "../components/SuperAdminSidebar";
import { FaDownload } from "react-icons/fa";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import "./BuyersList.css";

function BuyersList() {
  const [buyers, setBuyers] = useState([]);
  const [filteredBuyers, setFilteredBuyers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // load on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/api/auth/login");
    fetchBuyers(token);
  }, [navigate]);

  // fetch + sort
  const fetchBuyers = async (token) => {
    try {
      const res = await fetch("http://localhost:8070/api/users", {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Fetch error");
      const list = Array.isArray(data) ? data : data.users || [];
      const onlyBuyers = list
        .filter(u => u.role === "buyer")
        .sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
      setBuyers(onlyBuyers);
      setFilteredBuyers(onlyBuyers);
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Error fetching buyers");
    }
  };

  // live filter
  useEffect(() => {
    const q = searchTerm.trim().toLowerCase();
    setFilteredBuyers(
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
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this buyer?")) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:8070/api/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error((await res.json()).message);
      fetchBuyers(token);
    } catch (err) {
      console.error(err);
      alert(err.message || "Error deleting buyer");
    }
  };

  const handleDownloadPdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("All Buyers", 14, 22);
    const head = [["Email", "Full Name", "Created At"]];
    const body = filteredBuyers.map(b => [
      b.email,
      `${b.firstName} ${b.lastName}`,
      new Date(b.createdAt).toLocaleString()
    ]);
    autoTable(doc, {
      head,
      body,
      startY: 28,
      headStyles: { fillColor:[243,244,246], textColor:[107,114,128], fontStyle:"bold" },
      styles: { fontSize:10 }
    });
    doc.save("buyers_list.pdf");
  };

  return (
    <div className="superadmin-layout">
      <SuperAdminSidebar />
      <main className="superadmin-main">
        <div className="buyers-header">
          <button className="download-pdf" onClick={handleDownloadPdf}>
            <FaDownload /> Download PDF
          </button>
          <h2>All Buyers</h2>
          <button className="add-buyer-button" onClick={handleAdd}>
            Add Buyer
          </button>
          <input
            type="text"
            className="search-input"
            placeholder="Search buyers…"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        {message && <div className="alert-info">{message}</div>}

        {filteredBuyers.length > 0 ? (
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
              {filteredBuyers.map(b => (
                <tr key={b._id}>
                  <td>{b.email}</td>
                  <td>{`${b.firstName} ${b.lastName}`}</td>
                  <td>{new Date(b.createdAt).toLocaleString()}</td>
                  <td className="action-buttons">
                    <button className="edit-button" onClick={() => handleUpdate(b._id)}>
                      Update
                    </button>
                    <button className="delete-button" onClick={() => handleDelete(b._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="alert-info">No buyers found.</div>
        )}
      </main>
    </div>
  );
}

export default BuyersList;