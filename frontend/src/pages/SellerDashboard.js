// src/pages/SellerDashboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SellerOverview from '../components/SellerOverview';
import SellerOrders from '../components/SellerOrders';
import SellerListings from '../components/SellerListings';
import SellerReports from '../components/SellerReports';
import { Link } from 'react-router-dom';
import axios from 'axios';

function SellerDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve logged-in seller
  const seller =
    location.state?.seller ||
    JSON.parse(localStorage.getItem('user') || 'null');

  // Low-stock alert
  const [lowStockItems, setLowStockItems] = useState([]);

  useEffect(() => {
    const notifyLowStock = async () => {
      try {
        const { data } = await axios.get('http://localhost:8070/api/products');
        const low = data.filter(p => p.stockQuantity < 3);
        setLowStockItems(low);
        if (low.length > 0) {
          alert(
            `⚠️ Low stock on ${low.length} item${low.length > 1 ? 's' : ''}: ` +
              low.map(p => `${p.name} (${p.stockQuantity})`).join(', ')
          );
        }
      } catch (err) {
        console.error('Failed low-stock check:', err);
      }
    };
    notifyLowStock();
  }, []);

  // UI state
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Trigger search
  const handleSearch = e => {
    e.preventDefault();
    setIsSearching(true);
  };

  // Simulate search
  useEffect(() => {
    if (!isSearching) return;
    const fetchResults = async () => {
      try {
        await new Promise(res => setTimeout(res, 500));
        const mock = [
          { id: 1, name: 'Product 1', price: 19.99, category: 'electronics', createdAt: '2025-01-15' },
          { id: 2, name: 'Product 2', price: 29.99, category: 'clothing', createdAt: '2025-02-20' },
          { id: 3, name: 'Product 3', price: 39.99, category: 'home', createdAt: '2025-03-10' },
        ];
        let results = mock.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
        if (category) results = results.filter(p => p.category === category);
        switch (sortOrder) {
          case 'newest':
            results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            break;
          case 'oldest':
            results.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            break;
          case 'price-asc':
            results.sort((a, b) => a.price - b.price);
            break;
          case 'price-desc':
            results.sort((a, b) => b.price - a.price);
            break;
          default:
            break;
        }
        setSearchResults(results);
        setActiveTab('listings');
      } catch (err) {
        console.error('Error searching products:', err);
      } finally {
        setIsSearching(false);
      }
    };
    fetchResults();
  }, [isSearching, searchQuery, category, sortOrder]);

  // Render content per tab
  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <SellerOverview seller={seller} lowStock={lowStockItems} />;
      case 'orders':
        return <SellerOrders />;
      case 'listings':
        return (
          <SellerListings
            searchQuery={searchQuery}
            searchResults={searchResults}
            isSearching={isSearching}
          />
        );
      case 'reports':
        return <SellerReports />;
      default:
        return <SellerOverview seller={seller} lowStock={lowStockItems} />;
    }
  };

  return (
    <div className="dashboard-bg d-flex" style={{
      backgroundImage: 'url(/images/coreui_1200_630.jpg)',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center center',
      minHeight: '100vh',
    }}>
      {/* Sidebar */}
      <aside
        className="bg-dark text-white"
        style={{ width: '250px', minHeight: '100vh', backgroundColor: 'rgba(0,0,0,0.85)', boxShadow: '2px 0 5px rgba(0,0,0,0.1)' }}
      >
        <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
          <Link to="/home" state={{ seller }} className="text-decoration-none">
            <h5 className="mb-0">Xaphora Dress</h5>
          </Link>
          <button className="btn btn-sm text-white">
            <i className="bi bi-list"></i>
          </button>
        </div>
        <nav className="mt-3">
          <div className="px-3 py-2 small text-muted">CORE</div>
          <div
            className={`px-3 py-2 d-flex align-items-center ${activeTab === 'overview' ? 'bg-primary' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <i className="bi bi-speedometer2 me-2"></i>Dashboard
          </div>
          <div className="px-3 py-2 mt-3 small text-muted">STORE</div>
          <div
            className={`px-3 py-2 d-flex align-items-center ${activeTab === 'listings' ? 'bg-primary' : ''}`}
            onClick={() => setActiveTab('listings')}
          >
            <i className="bi bi-box me-2"></i>Products
          </div>
          <div
            className={`px-3 py-2 d-flex align-items-center ${activeTab === 'orders' ? 'bg-primary' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <i className="bi bi-cart me-2"></i>Orders
          </div>
          <div
            className={`px-3 py-2 d-flex align-items-center ${activeTab === 'reports' ? 'bg-primary' : ''}`}
            onClick={() => setActiveTab('reports')}
          >
            <i className="bi bi-file-earmark-bar-graph me-2"></i>Reports
          </div>
        </nav>
        <div className="mt-auto p-3 border-top" style={{ position: 'absolute', bottom: 0, width: '250px' }}>
          {seller && (
            <div className="d-flex align-items-center">
              <div className="rounded-circle bg-primary p-2 me-2">
                <i className="bi bi-person-fill text-white"></i>
              </div>
              <div>
                <small className="text-white">Logged in as:</small>
                <div className="text-white">{seller.name}</div>
                <small className="text-muted">Store: {seller.storeName}</small>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow-1">
        {lowStockItems.length > 0 && (
          <div className="alert alert-warning text-center m-3">
            ⚠️ Low stock on {lowStockItems.length} item{lowStockItems.length > 1 ? 's' : ''}: {lowStockItems.map(p => `${p.name} (${p.stockQuantity})`).join(', ')}
          </div>
        )}
        <header className="navbar navbar-expand navbar-light bg-white border-bottom">
          <div className="container-fluid">
            <button className="navbar-toggler"><span className="navbar-toggler-icon" /></button>
            <div className="d-flex ms-auto align-items-center">
              <div className="input-group me-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search for..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
                <button className="btn btn-primary" onClick={handleSearch} disabled={isSearching}>
                  {isSearching ? (
                    <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true" />
                  ) : (
                    <i className="bi bi-search" />
                  )}
                </button>
              </div>
              <div className="dropdown">
                <button className="btn btn-light dropdown-toggle" data-bs-toggle="dropdown">
                  <i className="bi bi-person-circle me-2" />{seller.name}
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li><Link className="dropdown-item" to="#"><i className="bi bi-person me-2" />Profile</Link></li>
                  <li><Link className="dropdown-item" to="#"><i className="bi bi-gear me-2" />Settings</Link></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><button className="dropdown-item" onClick={() => navigate('/api/auth/login')}><i className="bi bi-box-arrow-right me-2" />Logout</button></li>
                </ul>
              </div>
            </div>
          </div>
        </header>

        <section className="p-4">
          <h1 className="mb-1">Dashboard</h1>
          <p className="text-muted">Overview of your store performance</p>

          {/* Search & Filters Card */}
          <div className="card mb-4">
            <div className="card-header bg-light d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Product Search</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSearch}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="input-group">...
                    </div>
                  </div>
                  {/* filters omitted for brevity */}
                </div>
              </form>
            </div>
          </div>

          {/* Tabs Card */}
          <div className="card mb-4">...
          </div>

          {/* Actions */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <button className="btn btn-success me-2" onClick={() => navigate('/add-product')}>
              <i className="bi bi-plus-circle me-1" /> Add Product
            </button>
            <button className="btn btn-primary" onClick={() => navigate('/products')}>
              <i className="bi bi-card-list me-1" /> View Products
            </button>
          </div>

          {renderContent()}
        </section>
      </main>
    </div>
  );
}

export default SellerDashboard;