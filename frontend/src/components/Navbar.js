// src/components/Navbar.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaBars,
  FaHeart,
  FaSearch,
  FaShoppingCart,
  FaUser
} from 'react-icons/fa';
import AccountDrawer from './AccountDrawer';
import './Navbar.css';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen]   = useState(false);
  const [drawerOpen, setDrawerOpen]   = useState(false);
  const navigate = useNavigate();

  // grab token and userName from storage
  const token    = localStorage.getItem('token');
  const userType = localStorage.getItem('userType');
  const userName = localStorage.getItem('userName') || '';

  // search handler
  const handleSearch = e => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  // drawer action handlers
  const handleAccountDetails = () => {
    navigate('/dashboard');
    setDrawerOpen(false);
  };
  const handleAddresses      = () => {
    navigate('/address');
    setDrawerOpen(false);
  };
  const handleChangePassword = () => {
    navigate('/change-password');
    setDrawerOpen(false);
  };
  const handleUpdateProfile  = () => {
    navigate('/update-profile');
    setDrawerOpen(false);
  };
  const handleDeleteProfile  = async () => {
    if (!window.confirm('Delete your profile?')) return;
    const token = localStorage.getItem('token');
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
  const handleLogout        = () => {
    localStorage.clear();
    setDrawerOpen(false);
    navigate('/api/auth/login');
  };

  return (
    <>
      {/* Top Bar */}
      <div className="top-bar">Free shipping on orders over Rs 5000</div>

      {/* Header */}
      <header className="header">
        <div className="header-content">
          <Link to="/" className="logo">Xaphora Dress</Link>

          <form className="search-bar" onSubmit={handleSearch}>
            <input
              type="text"
              className="search-input"
              placeholder="Search products..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <button className="search-button" type="submit">
              <FaSearch />
            </button>
          </form>

          <div className="header-actions">
            <Link to="/wishlist">
              <FaHeart className="nav-icon" />
            </Link>

            {/* Profile icon: open drawer if logged in, else go to login */}
            {token ? (
              <span
                className="header-icon"
                onClick={() => setDrawerOpen(true)}
                role="button"
                tabIndex={0}
                onKeyPress={e => e.key === 'Enter' && setDrawerOpen(true)}
              >
                <FaUser className="nav-icon" />
              </span>
            ) : (
              <Link to="/api/auth/login" className="header-icon">
                <FaUser />
              </Link>
            )}

            <Link to="/cart">
              <FaShoppingCart className="nav-icon" />
            </Link>

            <button
              className="mobile-menu-btn"
              onClick={() => setIsMenuOpen(o => !o)}
            >
              <FaBars />
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="main-nav">
        <div className="nav-container">
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

      {/* Account Drawer */}
      <AccountDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        userName={userName}
        onAccountDetails={handleAccountDetails}
        onAddresses={handleAddresses}
        onChangePassword={handleChangePassword}
        onUpdateProfile={handleUpdateProfile}
        onDeleteProfile={handleDeleteProfile}
        onLogout={handleLogout}
      />
    </>
  );
};

export default Navbar;
