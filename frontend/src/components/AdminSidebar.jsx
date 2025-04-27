import React from "react";
import { Link, useLocation } from "react-router-dom";

const AdminSidebar = () => {
  const location = useLocation();

  const navLinks = [
    { path: "/admin-orders", label: "Manage Orders" },
    { path: "/products", label: "Manage Products" },
    { path: "/superadmin/buyers", label: "Manage Buyers" },
    { path: "/superadmin/sellers", label: "Manage Sellers" },
    { path: "/add-product", label: "Add New Product" },
  ];

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div
      style={{
        width: "250px",
        minHeight: "100vh",
        backgroundColor: "#2c3e50",
        color: "#fff",
        padding: "20px",
        position: "fixed",
      }}
    >
      <h2 style={{ marginBottom: "30px", textAlign: "center" }}>Admin Panel</h2>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {navLinks.map((link) => (
          <li key={link.path} style={{ marginBottom: "20px" }}>
            <Link
              to={link.path}
              style={{
                color: location.pathname === link.path ? "#f1c40f" : "#ecf0f1",
                textDecoration: "none",
                fontSize: "18px",
              }}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      <button
        onClick={handleLogout}
        style={{
          marginTop: "30px",
          width: "100%",
          padding: "10px",
          backgroundColor: "#e74c3c",
          border: "none",
          color: "#fff",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default AdminSidebar;
