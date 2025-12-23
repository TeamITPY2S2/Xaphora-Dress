// src/components/Navbar.js
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaHeart,
  FaSearch,
  FaShoppingCart,
  FaUser,
  FaBars,
  FaTimes
} from 'react-icons/fa';
import AccountDrawer from './AccountDrawer';
import './Navbar.css';

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
            <Link to="/cakes">Cakes</Link>
          </nav>

          {/* Actions */}
          <div className="xaphora-actions">
            <form className="search-form" onSubmit={handleSearch}>
              
                <FaSearch className='search-icon' />
                <input
                  type="text"
                  placeholder="Search products..."
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