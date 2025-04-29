import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaUserShield,
  FaStore,
  FaUsers,
  FaSignOutAlt,
} from "react-icons/fa";
import "./SuperAdminSidebar.css";

export default function SuperAdminSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    navigate("/api/auth/login");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <div
          className="sidebar-brand"
          onClick={() => navigate("/home")}
        >
          Xaphora Dress
        </div>
        <div
          className="sidebar-role"
          onClick={() => navigate("/superadmin")}
        >
          Xaphora Admin
        </div>
      </div>

      <nav className="sidebar-nav">
        <NavLink
          to="/superadmin/admins"
          className="sidebar-link"
        >
          <FaUserShield className="sidebar-icon" />
          Admins
        </NavLink>
        <NavLink
          to="/superadmin/sellers"
          className="sidebar-link"
        >
          <FaStore className="sidebar-icon" />
          Sellers
        </NavLink>
        <NavLink
          to="/superadmin/buyers"
          className="sidebar-link"
        >
          <FaUsers className="sidebar-icon" />
          Buyers
        </NavLink>
      </nav>

      <button className="sidebar-logout" onClick={handleLogout}>
        <FaSignOutAlt className="sidebar-icon" />
        Logout
      </button>
    </aside>
  );
}