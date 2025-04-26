// src/components/Navbar.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaHeart, FaSearch, FaShoppingCart, FaUser } from 'react-icons/fa';
import './Navbar.css'; // create and style this CSS file

const AccountLink = () => {
  const token = localStorage.getItem("token");
  const userType = localStorage.getItem("userType");

  let route = "/api/auth/login";
  if (token) {
    switch (userType) {
      case "super-admin":
        route = "/superadmin";
        break;
      case "admin":
      case "buyer":
        route = "/dashboard";
        break;
      case "seller":
        route = "/seller-dashboard";
        break;
      default:
        route = "/dashboard";
    }
  }

  return (
    <Link to={route}>
      <FaUser />
    </Link>
  );
};

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* Top Bar */}
      <div className="top-bar">Free shipping on orders over Rs 5000</div>

      {/* Header */}
      <header className="header">
        <div className="header-content">
          <Link to="/" className="logo">
            Xaphora Dress
          </Link>

          <div className="search-bar">
            <input
              type="text"
              className="search-input"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="search-button">
              <FaSearch />
            </button>
          </div>

          <div className="header-actions">
            <Link to="/wishlist">
              <FaHeart />
            </Link>
            <AccountLink />
            <Link to="/cart">
              <FaShoppingCart />
            </Link>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="main-nav">
        <div className="nav-container">
          <button
            className="mobile-menu-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <FaBars />
          </button>
          <ul className={`nav-list ${isMenuOpen ? 'show' : ''}`}>
            <li><Link to="/women" className="nav-link">Women</Link></li>
            <li><Link to="/men" className="nav-link">Men</Link></li>
            <li><Link to="/kids" className="nav-link">Kids & Baby</Link></li>
            <li><Link to="/beauty" className="nav-link">Beauty & Health</Link></li>
            <li><Link to="/shoes" className="nav-link">Shoes & Bags</Link></li>
            <li><Link to="/watches" className="nav-link">Watches</Link></li>
            <li><Link to="/toys" className="nav-link">Toys</Link></li>
            <li><Link to="/home" className="nav-link">Home & Living</Link></li>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Navbar;