import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Add logout logic here
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <Link to="/admin-dashboard" className="brand-name">Xaphora Dress</Link>
        <Link to="/admin-dashboard" className="sub-heading">Xaphora Admin</Link>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          <Link to="/admin-dashboard/addDeliveryAgent" className="nav-item">
            <i className="fas fa-user-plus"></i>
            <span>Add Agent</span>
          </Link>
          
          <Link to="/admin-dashboard/agents" className="nav-item">
            <i className="fas fa-users"></i>
            <span>View Agents</span>
          </Link>
          
          <Link to="/admin-dashboard/assign-orders" className="nav-item">
            <i className="fas fa-tasks"></i>
            <span>Assign Order</span>
          </Link>

          <Link to="/admin-dashboard/order" className="nav-item">
            <i className="fas fa-shipping-fast"></i>
            <span>Orders and Tracking</span>
          </Link>
        </div>
      </nav>

      <button className="logout-button" onClick={handleLogout}>
        <i className="fas fa-sign-out-alt"></i>
        <span>Logout</span>
      </button>
    </div>
  );
};

export default Sidebar; 