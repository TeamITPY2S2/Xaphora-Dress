// src/components/Navbar.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaHeart,
  FaSearch,
  FaShoppingCart,
  FaUser,
  FaBars
} from 'react-icons/fa';
import AccountDrawer from './AccountDrawer';
import './Navbar.css';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const userName = localStorage.getItem('userName') || '';

  const handleSearch = e => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setDrawerOpen(false);
    navigate('/api/auth/login');
  };

  const handleDeleteProfile = async () => {
    if (!window.confirm('Delete your profile?')) return;
    try {
      const res = await fetch('http://localhost:8070/api/dashboard/profile/delete', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        alert('Profile deleted');
        handleLogout();
      } else {
        const { message } = await res.json();
        alert(message || 'Failed to delete');
      }
    } catch {
      alert('Error deleting profile');
    }
  };

  return (
    <>
      {/* Top bar */}
      <div className="top-bar">Free shipping on orders over Rs 5000</div>

      {/* Navbar header */}
      <header className="xaphora-header">
        <div className="xaphora-container">
          {/* Logo */}
          <Link to="/" className="xaphora-logo">Xaphora Dress</Link>

          {/* Navigation */}
          <nav className="xaphora-nav">
            <Link to="/women">Women</Link>
            <Link to="/men">Men</Link>
            <Link to="/kids">Kids & Baby</Link>
          </nav>

          {/* Actions */}
          <div className="xaphora-actions">
            <form className="search-form" onSubmit={handleSearch}>
              <FaSearch className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search for a Product"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </form>

            <Link to="/wishlist"><FaHeart className="nav-icon" /></Link>

            {token ? (
              <span
                className="nav-icon clickable"
                onClick={() => setDrawerOpen(true)}
                role="button"
                tabIndex={0}
                onKeyPress={e => e.key === 'Enter' && setDrawerOpen(true)}
              >
                <FaUser />
              </span>
            ) : (
              <Link to="/api/auth/login"><FaUser className="nav-icon" /></Link>
            )}

            <Link to="/cart"><FaShoppingCart className="nav-icon" /></Link>

            <button
              className="mobile-menu-btn"
              onClick={() => setIsMenuOpen(prev => !prev)}
            >
              <FaBars />
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="mobile-nav">
            <Link to="/women">Women</Link>
            <Link to="/men">Men</Link>
            <Link to="/kids">Kids & Baby</Link>
          </div>
        )}
      </header>

      {/* Drawer */}
      <AccountDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        userName={userName}
        onAccountDetails={() => navigate('/dashboard')}
        onAddresses={() => navigate('/address')}
        onChangePassword={() => navigate('/change-password')}
        onUpdateProfile={() => navigate('/update-profile')}
        onDeleteProfile={handleDeleteProfile}
        onLogout={handleLogout}
      />
    </>
  );
};

export default Navbar;