import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

import SellerOverview from '../components/SellerOverview';
import SellerOrders   from '../components/SellerOrders';
import SellerListings from '../components/SellerListings';
import SellerReports  from '../components/SellerReports';

import './SellerDashboard.css';

function SellerDashboard() {
  const navigate = useNavigate();

  // controls sidebar open/closed
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // various pieces of state
  const [lowStockItems, setLowStockItems] = useState([]);
  const [activeTab, setActiveTab]         = useState('overview');
  const [searchQuery, setSearchQuery]     = useState('');
  const [category, setCategory]           = useState('');
  const [sortOrder, setSortOrder]         = useState('newest');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching]     = useState(false);
  const [sellerInfo, setSellerInfo]       = useState({
    name: '', storeName: '', email: '', joinDate: ''
  });
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState('');

  // LOGOUT handler
  const handleLogout = () => {
    localStorage.removeItem('seller_token');
    localStorage.removeItem('seller_info');
    localStorage.removeItem('seller_id');
    navigate('/seller/login');
  };

  // ——— low-stock alert (popup + banner) ———
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get('http://localhost:8070/api/products');
        const low = data.filter(p => p.stockQuantity < 3);
        setLowStockItems(low);

        if (low.length) {
          alert(
            `⚠️ Low stock on ${low.length} item${low.length > 1 ? 's' : ''}: ` +
            low.map(p => `${p.name} (${p.stockQuantity})`).join(', ')
          );
        }
      } catch (err) {
        console.error('Failed low-stock check:', err);
      }
    })();
  }, []);

  // auth + seller info
  useEffect(() => {
    const token = localStorage.getItem('seller_token');
    if (!token) return navigate('/seller/login');

    const stored = localStorage.getItem('seller_info');
    if (stored) {
      const s = JSON.parse(stored);
      setSellerInfo({
        name: s.name,
        storeName: s.storeName,
        email: s.email,
        joinDate: new Date(s.joinDate).toLocaleDateString()
      });
      setLoading(false);
    } else {
      fetchSellerData(token);
    }
  }, [navigate]);

  const fetchSellerData = async (token) => {
    try {
      const sellerId = localStorage.getItem('seller_id');
      if (!sellerId) throw new Error('No seller ID found');
      const resp = await fetch(`http://localhost:8070/api/sellers/${sellerId}`, {
        headers: {
          'Content-Type':'application/json',
          'Authorization':`Bearer ${token}`
        }
      });
      if (!resp.ok) throw new Error('Failed to fetch seller data');
      const d = await resp.json();
      localStorage.setItem('seller_info', JSON.stringify({
        name: d.name,
        storeName: d.storeName,
        email: d.email,
        joinDate: d.createdAt
      }));
      setSellerInfo({
        name: d.name,
        storeName: d.storeName,
        email: d.email,
        joinDate: new Date(d.createdAt).toLocaleDateString()
      });
      setLoading(false);
    } catch(err) {
      console.error(err);
      setError('Could not load seller info.');
      setLoading(false);
    }
  };

  // mock search flow
  useEffect(() => {
    if (!isSearching) return;
    (async () => {
      try {
        await new Promise(r => setTimeout(r, 500));
        const mock = [
          { id:1, name:'Product 1', price:19.99, category:'electronics', createdAt:'2025-01-15' },
          { id:2, name:'Product 2', price:29.99, category:'clothing',    createdAt:'2025-02-20' },
          { id:3, name:'Product 3', price:39.99, category:'home',        createdAt:'2025-03-10' },
        ];
        let res = mock.filter(p =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        if (category)      res = res.filter(p => p.category === category);
        if (sortOrder==='newest')     res.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
        if (sortOrder==='oldest')     res.sort((a,b) => new Date(a.createdAt) - new Date(b.createdAt));
        if (sortOrder==='price-asc')  res.sort((a,b) => a.price - b.price);
        if (sortOrder==='price-desc') res.sort((a,b) => b.price - a.price);
        setSearchResults(res);
        setActiveTab('listings');
      } catch(err) {
        console.error(err);
      } finally {
        setIsSearching(false);
      }
    })();
  }, [isSearching]);

  const handleSearch = e => {
    e.preventDefault();
    setIsSearching(true);
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'overview': return <SellerOverview />;
      case 'orders':   return <SellerOrders />;
      case 'listings': return (
        <SellerListings
          searchQuery={searchQuery}
          searchResults={searchResults}
          isSearching={isSearching}
        />
      );
      case 'reports':  return <SellerReports />;
      default:         return <SellerOverview />;
    }
  };

  return (
    <div className="dashboard-bg">
      {/* Sidebar */}
      <aside className={`sidebar bg-dark text-white ${sidebarOpen ? '' : 'closed'}`}>
        <div className="sidebar-header d-flex align-items-center justify-content-between">
          <Link to="/home" className="text-decoration-none text-white">
            <h5>Xaphora Dress</h5>
          </Link>
          <button
            className="btn btn-sm text-white toggle-btn"
            onClick={() => setSidebarOpen(o => !o)}
          >
            <i className="bi bi-list"></i>
          </button>
        </div>

        <div className="sidebar-profile p-3 border-bottom">
          {loading
            ? <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading…</span>
              </div>
            : error
              ? <div className="text-danger">{error}</div>
              : (
                <div className="d-flex align-items-center">
                  <div className="rounded-circle bg-primary p-3 me-2">
                    <i className="bi bi-person-fill text-white"></i>
                  </div>
                  <div>
                    <h6 className="mb-0">{sellerInfo.name}</h6>
                    <small>{sellerInfo.storeName}</small>
                  </div>
                </div>
              )
          }
        </div>

        <nav className="sidebar-nav flex-grow-1 d-flex flex-column">
          <small className="text-muted px-3 mt-3">CORE</small>
          <button
            className={`nav-item px-3 py-2 ${activeTab==='overview'?'active':''}`}
            onClick={() => setActiveTab('overview')}
          >
            <i className="bi bi-speedometer2 me-2"></i> Dashboard
          </button>

          <small className="text-muted px-3 mt-3">STORE</small>
          <button
            className={`nav-item px-3 py-2 ${activeTab==='listings'?'active':''}`}
            onClick={() => setActiveTab('listings')}
          >
            <i className="bi bi-box me-2"></i> Products
          </button>
          <button
            className={`nav-item px-3 py-2 ${activeTab==='orders'?'active':''}`}
            onClick={() => setActiveTab('orders')}
          >
            <i className="bi bi-cart me-2"></i> Orders
          </button>

          <small className="text-muted px-3 mt-3">ANALYTICS</small>
          <button
            className={`nav-item px-3 py-2 ${activeTab==='reports'?'active':''}`}
            onClick={() => setActiveTab('reports')}
          >
            <i className="bi bi-bar-chart-line me-2"></i> Reports
          </button>

          {/* push logout to bottom */}
          <button
            className="nav-item px-3 py-2 mt-auto text-danger"
            onClick={handleLogout}
          >
            <i className="bi bi-box-arrow-right me-2"></i> Logout
          </button>
        </nav>

        <div className="sidebar-footer p-3 border-top">
          {!loading && !error && (
            <div className="d-flex align-items-center">
              <div className="rounded-circle bg-primary p-2 me-2">
                <i className="bi bi-person-fill text-white"></i>
              </div>
              <div>
                <small>Logged in as:</small>
                <div>{sellerInfo.name}</div>
                <small className="text-muted">Store: {sellerInfo.storeName}</small>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-grow-1">
        {/* Top navbar */}
        <nav className="navbar navbar-expand navbar-light bg-white border-bottom seller-nav px-4">
          <form className="d-flex flex-grow-1 align-items-center" onSubmit={handleSearch}>
            <div className="input-group w-50">
              <input
                type="text"
                className="form-control"
                placeholder="Search for…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <button className="btn btn-primary" type="submit" disabled={isSearching}>
                <i className="bi bi-search"></i>
              </button>
            </div>

            <div className="dropdown ms-auto">
              <button
                className="btn btn-light dropdown-toggle d-flex align-items-center"
                data-bs-toggle="dropdown"
              >
                <i className="bi bi-person-circle me-2"></i>
                {loading ? 'Loading…' : sellerInfo.name}
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <Link className="dropdown-item" to="#">
                    <i className="bi bi-person me-2"></i>Profile
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="#">
                    <i className="bi bi-gear me-2"></i>Settings
                  </Link>
                </li>
                <li><hr className="dropdown-divider"/></li>
                <li>
                  <button className="dropdown-item" onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right me-2"></i>Logout
                  </button>
                </li>
              </ul>
            </div>
          </form>
        </nav>

        <div className="content-area px-4 py-4">
          {/* Low-stock banner */}
          {lowStockItems.length > 0 && (
            <div className="alert alert-warning text-center mb-4">
              ⚠️ Low stock on {lowStockItems.length} item{lowStockItems.length>1?'s':''}:&nbsp;
              {lowStockItems.map(p => `${p.name} (${p.stockQuantity})`).join(', ')}
            </div>
          )}

          <h1 className="mb-1">Dashboard</h1>
          <p className="text-muted mb-4">Overview of your store</p>

          {/* Search Card */}
          <div className="card mb-4">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Product Search</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSearch}>
                <div className="row g-3 align-items-center">
                  <div className="col-md-6">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search products…"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                      />
                      <button className="btn btn-primary" type="submit" disabled={isSearching}>
                        {isSearching
                          ? <span className="spinner-border spinner-border-sm me-1" role="status" />
                          : <i className="bi bi-search me-1" />}
                        Search
                      </button>
                    </div>  
                  </div>
                  <div className="col-md-3">
                    <select
                      className="form-select"
                      value={category}
                      onChange={e => setCategory(e.target.value)}
                    >
                      <option value="">All Categories</option>
                      <option value="electronics">Electronics</option>
                      <option value="clothing">Clothing</option>
                      <option value="home">Home & Garden</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <select
                      className="form-select"
                      value={sortOrder}
                      onChange={e => setSortOrder(e.target.value)}
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                    </select>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Tabs & content */}
          <div className="card mb-4">
            <div className="card-header p-0">
              <ul className="nav nav-tabs card-header-tabs">
                {['overview','orders','listings','reports'].map(tab => (
                  <li className="nav-item" key={tab}>
                    <button
                      className={`nav-link ${activeTab===tab?'active':''}`}
                      onClick={() => setActiveTab(tab)}
                    >
                      {tab.charAt(0).toUpperCase()+tab.slice(1)}
                      {(tab==='listings' && searchResults.length>0) &&
                        <span className="badge bg-primary ms-1">{searchResults.length}</span>
                      }
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="card-body">
              {renderContent()}
            </div>
          </div>

          {/* Bottom action buttons */}
          <div className="d-flex justify-content-between">
            <button className="btn btn-success" onClick={() => navigate('/add-product')}>
              <i className="bi bi-plus-circle me-1" /> Add Product
            </button>
            <button className="btn btn-primary" onClick={() => navigate('/products')}>
              <i className="bi bi-card-list me-1" /> View Products
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default SellerDashboard;
