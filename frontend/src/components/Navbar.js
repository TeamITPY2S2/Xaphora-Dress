// src/components/Navbar.js
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaHeart,
  FaSearch,
  FaShoppingCart,
  FaUser,
  FaBars,
  FaTimes,
  FaChevronDown
} from 'react-icons/fa';
import AccountDrawer from './AccountDrawer';
import './Navbar.css';

// ============================================
// PROMO BAR CONFIG - Easy to update for seasons/festivals
// ============================================
// HOW TO UPDATE:
// - simpleMessage: Use this for a basic announcement (set codes to empty array [])
// - codes: Array of promo offers. Each has: code, description, discount
// 
// EXAMPLES:
// Simple message: { simpleMessage: "Free Shipping on Orders Over Rs 5000", codes: [] }
// Promo codes: { simpleMessage: "", codes: [{ code: "SAVE10", description: "SHOP ABOVE 10,000", discount: "GET 10% OFF" }] }
// ============================================
const PROMO_CONFIG = {
  simpleMessage: "Free Shipping on Orders Over Rs 5,000 | New Arrivals Every Week",
  codes: [] // Empty = show simpleMessage. Add codes for promos.
};

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const abortRef = useRef();
  const inputRef = useRef();
  const searchWrapperRef = useRef();
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const userName = localStorage.getItem('userName') || '';

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(e.target)) {
        setSearchOpen(false);
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchIconClick = () => {
    setSearchOpen(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleSearch = e => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setShowSuggestions(false);
      setActiveIndex(-1);
    }
  };
  // Fetch suggestions (debounced)
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    const handler = setTimeout(async () => {
      try {
        abortRef.current?.abort();
        const controller = new AbortController();
        abortRef.current = controller;
        const res = await fetch(`http://localhost:8070/api/products/suggest?q=${encodeURIComponent(searchQuery.trim())}&limit=8`, { signal: controller.signal });
        if (!res.ok) return;
        const data = await res.json();
        setSuggestions(data);
        setShowSuggestions(true);
        setActiveIndex(-1);
      } catch (err) {
        if (err.name !== 'AbortError') {
          // silent
        }
      }
    }, 250);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Keyboard navigation in suggestions
  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => (prev + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => (prev - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === 'Enter') {
      if (activeIndex >= 0) {
        const item = suggestions[activeIndex];
        navigate(`/product/${item._id}`);
        setShowSuggestions(false);
        setSearchQuery('');
        setActiveIndex(-1);
        e.preventDefault();
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setActiveIndex(-1);
    }
  };

  // Close suggestions on outside click
  useEffect(() => {
    const close = (e) => {
      if (!inputRef.current) return;
      if (!inputRef.current.parentElement?.parentElement?.contains(e.target)) {
        setShowSuggestions(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

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
      {/* Promo announcement bar - Easy to update for seasons/festivals */}
      <div className="promo-bar">
        {PROMO_CONFIG.codes.length > 0 ? (
          // Show promo codes when available
          PROMO_CONFIG.codes.map((promo, idx) => (
            <span key={promo.code}>
              {idx > 0 && <span className="separator">|</span>}
              USE CODE '<span className="highlight">{promo.code}</span>' {promo.description} {promo.discount}
            </span>
          ))
        ) : (
          // Show simple message when no promo codes
          <span>{PROMO_CONFIG.simpleMessage}</span>
        )}
      </div>

      {/* Navbar header */}
      <header className="xaphora-header">
        <div className="xaphora-container">
          {/* Logo */}
          <Link to="/" className="xaphora-logo">XAPHORA</Link>

          {/* Navigation */}
          <nav className="xaphora-nav">
            <span className="nav-link">
              MEN <FaChevronDown className="dropdown-arrow" />
            </span>
            <span className="nav-link">
              WOMEN <FaChevronDown className="dropdown-arrow" />
            </span>
            <Link to="/kids">KIDS & BABY</Link>
            <Link to="/cakes">CAKES</Link>
            <Link to="/products">NEW ARRIVALS</Link>
          </nav>

          {/* Actions */}
          <div className="xaphora-actions">
            {/* Search - Click icon to expand */}
            <div className={`search-wrapper ${searchOpen ? 'open' : ''}`} ref={searchWrapperRef}>
              {!searchOpen ? (
                <button 
                  type="button" 
                  className="search-icon-btn" 
                  onClick={handleSearchIconClick}
                  aria-label="Open search"
                >
                  <FaSearch />
                </button>
              ) : (
                <form className="search-form" onSubmit={handleSearch}>
                  <div className="search-field">
                    <FaSearch className="search-icon" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      onKeyDown={handleKeyDown}
                      onFocus={() => suggestions.length && setShowSuggestions(true)}
                      ref={inputRef}
                      className="search-input"
                      autoFocus
                    />
                    <button
                      type="button"
                      className="search-close-btn"
                      aria-label="Close search"
                      onClick={() => { setSearchOpen(false); setSearchQuery(''); setSuggestions([]); setShowSuggestions(false); }}
                    >
                      <FaTimes />
                    </button>
                  </div>
                  {showSuggestions && suggestions.length > 0 && (
                    <ul className="search-suggestions" role="listbox">
                      {suggestions.map((s, idx) => (
                        <li
                          key={s._id}
                          role="option"
                          aria-selected={idx === activeIndex}
                          className={idx === activeIndex ? 'active' : ''}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            navigate(`/product/${s._id}`);
                            setShowSuggestions(false);
                            setSearchQuery('');
                            setSearchOpen(false);
                            setActiveIndex(-1);
                          }}
                          onMouseEnter={() => setActiveIndex(idx)}
                        >
                          {s.imageUrl && <img src={s.imageUrl} alt="" className="suggestion-thumb" />}
                          <div className="suggestion-info">
                            <span className="suggestion-name">{s.name}</span>
                            <span className="suggestion-meta">{s.category}{s.price ? ` • Rs ${Number(s.price).toLocaleString()}` : ''}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </form>
              )}
            </div>

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

            <Link to="/wishlist"><FaHeart className="nav-icon" /></Link>
            <Link to="/cart"><FaShoppingCart className="nav-icon" /></Link>

            <button
              className="mobile-menu-btn"
              onClick={() => setIsMenuOpen(prev => !prev)}
            >
              {isMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="mobile-nav">
            <Link to="/men" onClick={() => setIsMenuOpen(false)}>MEN</Link>
            <Link to="/women" onClick={() => setIsMenuOpen(false)}>WOMEN</Link>
            <Link to="/kids" onClick={() => setIsMenuOpen(false)}>KIDS & BABY</Link>
            <Link to="/cakes" onClick={() => setIsMenuOpen(false)}>CAKES</Link>
            <Link to="/products" onClick={() => setIsMenuOpen(false)}>NEW ARRIVALS</Link>
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