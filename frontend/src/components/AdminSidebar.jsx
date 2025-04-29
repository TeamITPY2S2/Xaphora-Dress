// src/components/AdminSidebar.js
import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./AdminSidebar.css";

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
    <div className="admin-sidebar">
      <Link to="/" className="sidebar-title">
        Xaphora Dress
      </Link>
      <ul className="sidebar-nav">
        {navLinks.map((link) => (
          <li key={link.path} className="sidebar-item">
            <Link
              to={link.path}
              className={`sidebar-link ${
                location.pathname === link.path ? "active" : ""
              }`}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
      <button className="sidebar-logout" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default AdminSidebar;
