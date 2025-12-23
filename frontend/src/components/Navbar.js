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
const PROMO_CONFIG = {
  message: "USE CODE",
  codes: [
    { code: "XMAS10", description: "SHOP ABOVE 15,000/=", discount: "GET 10% OFF" },
    { code: "XMAS15", description: "SHOP ABOVE 25,000/=", discount: "GET 15% OFF" }
  ]
};

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const abortRef = useRef();
  const inputRef = useRef();
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const userName = localStorage.getItem('userName') || '';

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
        {PROMO_CONFIG.codes.map((promo, idx) => (
          <span key={promo.code}>
            {idx > 0 && <span className="separator">|</span>}
            {PROMO_CONFIG.message} '<span className="highlight">{promo.code}</span>' {promo.description} {promo.discount}
          </span>
        ))}
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
            <form className="search-form" onSubmit={handleSearch}>
              <div className="search-field-wrapper">
                <FaSearch className='search-icon' />
                <input
                  type="text"
                  placeholder="Search for a Product"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => suggestions.length && setShowSuggestions(true)}
                  ref={inputRef}
                  className="search-input"
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="clear-search-btn"
                    aria-label="Clear search"
                    onClick={() => { setSearchQuery(''); setSuggestions([]); setShowSuggestions(false); inputRef.current?.focus(); }}
                  >
                    <FaTimes />
                  </button>
                )}
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