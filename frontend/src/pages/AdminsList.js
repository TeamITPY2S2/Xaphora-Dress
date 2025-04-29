// src/pages/AdminsList.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SuperAdminSidebar from "../components/SuperAdminSidebar";
import { FaDownload } from "react-icons/fa";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import "./AdminsList.css";

function AdminsList() {
  const [admins, setAdmins] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // fetch on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/api/auth/login");
      return;
    }
    fetchAdmins(token);
  }, [navigate]);

  // load & sort
  const fetchAdmins = async (token) => {
    try {
      const res = await fetch("http://localhost:8070/api/admins", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        const sorted = data.sort((a, b) => {
          if (a.adminType === "super-admin" && b.adminType !== "super-admin")
            return -1;
          if (b.adminType === "super-admin" && a.adminType !== "super-admin")
            return 1;
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        setAdmins(sorted);
        setFiltered(sorted);
      } else {
        setMessage(data.message || "Error fetching admins");
      }
    } catch (err) {
      console.error(err);
      setMessage("Error fetching admins");
    }
  };

  // live filter
  useEffect(() => {
    const q = searchTerm.trim().toLowerCase();
    setFiltered(
      !q
        ? admins
        : admins.filter((a) =>
            [
              a.email,
              `${a.firstName} ${a.lastName}`,
              a.adminType,
            ]
              .join(" ")
              .toLowerCase()
              .includes(q)
          )
    );
  }, [searchTerm, admins]);

  // navigation
  const handleAdd = () => navigate("/superadmin/add-admin");
  const handleUpdate = (id) => navigate(`/superadmin/update-admin/${id}`);
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this admin?")) return;
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:8070/api/admins/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (res.ok) fetchAdmins(token);
    else alert(data.message || "Failed to delete admin");
  };

  // PDF export of filtered
  const handleDownloadPdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("All Admins", 14, 22);

    const head = [["Email", "Full Name", "Admin Type", "Created At"]];
    const body = filtered.map((a) => [
      a.email,
      `${a.firstName} ${a.lastName}`,
      a.adminType,
      new Date(a.createdAt).toLocaleString(),
    ]);

    autoTable(doc, {
      head,
      body,
      startY: 28,
      headStyles: { fillColor: [243, 244, 246], textColor: [107, 114, 128], fontStyle: "bold" },
      styles: { fontSize: 10 },
    });

    doc.save("admins_list.pdf");
  };

  return (
    <div className="superadmin-layout">
      <SuperAdminSidebar />
      <main className="superadmin-main">
        {/* header with search, download, title, add */}
        <div className="buyers-header">
          
          <button className="download-pdf" onClick={handleDownloadPdf}>
            <FaDownload style={{ marginRight: 8 }} />
            Download PDF
          </button>
          <h2>All Admins</h2>
          <button className="add-buyer-button" onClick={handleAdd}>
            Add Admin
          </button>
          <input
            type="text"
            className="search-input"
            placeholder="Search admins…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {message && <div className="alert alert-info">{message}</div>}

        {filtered.length > 0 ? (
          <table className="buyers-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Full Name</th>
                <th>Admin Type</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a._id}>
                  <td>{a.email}</td>
                  <td>{`${a.firstName} ${a.lastName}`}</td>
                  <td>{a.adminType}</td>
                  <td>{new Date(a.createdAt).toLocaleString()}</td>
                  <td className="action-buttons">
                    <button className="edit-button" onClick={() => handleUpdate(a._id)}>
                      Update
                    </button>
                    <button className="delete-button" onClick={() => handleDelete(a._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="alert alert-info">No admins found.</div>
        )}
      </main>
    </div>
  );
}

export default AdminsList;