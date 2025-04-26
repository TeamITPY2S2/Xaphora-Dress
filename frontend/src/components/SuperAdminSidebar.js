import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaUserShield, FaStore, FaUsers, FaSignOutAlt } from "react-icons/fa";
import "./SuperAdminSidebar.css";

const SuperAdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    navigate("/api/auth/login");
  };

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <aside className="superadmin-sidebar">
      <h1><a href="/home" className="home">Xaphora Dress</a></h1>

      {/* Clickable admin title to go to dashboard */}
      <h2 className="admin-title" onClick={() => navigate("/superadmin")} style={{ cursor: "pointer" }}>
        Xaphora Admin
      </h2>

      <ul>
        <li className={isActive("/superadmin/admins") ? "active" : ""} onClick={() => navigate("/superadmin/admins")}>
          <FaUserShield /> Admins
        </li>
        <li className={isActive("/superadmin/sellers") ? "active" : ""} onClick={() => navigate("/superadmin/sellers")}>
          <FaStore /> Sellers
        </li>
        <li className={isActive("/superadmin/buyers") ? "active" : ""} onClick={() => navigate("/superadmin/buyers")}>
          <FaUsers /> Buyers
        </li>
      </ul>

      <button className="logout-btn" onClick={logout}>
        <FaSignOutAlt /> Logout
      </button>
    </aside>
  );
};

export default SuperAdminSidebar;