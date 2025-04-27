// src/pages/SellersList.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SuperAdminSidebar from "../components/SuperAdminSidebar";
import { FaDownload } from "react-icons/fa";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import "./SellersList.css";

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
    if (!window.confirm("Delete this seller?")) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:8070/api/sellers/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error((await res.json()).message);
      fetchSellers(token);
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to delete");
    }
  };

  const handleDownloadPdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("All Sellers", 14, 22);

    const head = [["Email", "Name", "Store", "Created At"]];
    const body = filtered.map(s => [
      s.email,
      s.name,
      s.storeName,
      new Date(s.createdAt).toLocaleString()
    ]);

    autoTable(doc, {
      head,
      body,
      startY: 28,
      headStyles: { fillColor: [243, 244, 246], textColor: [107, 114, 128], fontStyle: "bold" },
      styles: { fontSize: 10 }
    });

    doc.save("sellers_list.pdf");
  };

  return (
    <div className="superadmin-layout">
      <SuperAdminSidebar />
      <main className="superadmin-main">
        <div className="sellers-header">
          <button className="download-pdf" onClick={handleDownloadPdf}>
            <FaDownload /> Download PDF
          </button>
          <h2>All Sellers</h2>
          <button className="add-seller-button" onClick={handleAdd}>
            Add Seller
          </button>
          <input
            type="text"
            className="search-input"
            placeholder="Search sellers…"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        {message && <div className="alert alert-info">{message}</div>}

        {filtered.length > 0 ? (
          <table className="sellers-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Name</th>
                <th>Store</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s._id}>
                  <td>{s.email}</td>
                  <td>{s.name}</td>
                  <td>{s.storeName}</td>
                  <td>{new Date(s.createdAt).toLocaleString()}</td>
                  <td className="action-buttons">
                    <button className="edit-button" onClick={() => handleUpdate(s._id)}>
                      Update
                    </button>
                    <button className="delete-button" onClick={() => handleDelete(s._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="alert alert-info">No sellers found.</div>
        )}
      </main>
    </div>
  );
}

export default SellersList;