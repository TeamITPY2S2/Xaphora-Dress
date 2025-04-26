// src/pages/SellerDashboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SellerOverview from '../components/SellerOverview';
import SellerOrders from '../components/SellerOrders';
import SellerListings from '../components/SellerListings';
import SellerReports from '../components/SellerReports';
import { Link } from 'react-router-dom';

function SellerDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isSearching) {
      const fetchProducts = async () => {
        try {
          console.log(`Searching for: "${searchQuery}" in category: ${category || 'All'} sorted by: ${sortOrder}`);
          await new Promise(resolve => setTimeout(resolve, 500));
          const mockResults = [
            { id: 1, name: 'Product 1', price: 19.99, category: 'electronics', createdAt: '2025-01-15' },
            { id: 2, name: 'Product 2', price: 29.99, category: 'clothing', createdAt: '2025-02-20' },
            { id: 3, name: 'Product 3', price: 39.99, category: 'home', createdAt: '2025-03-10' },
          ];
          let filteredResults = mockResults.filter(product =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase())
          );
          if (category) {
            filteredResults = filteredResults.filter(product => product.category === category);
          }
          switch (sortOrder) {
            case 'newest':
              filteredResults.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
              break;
            case 'oldest':
              filteredResults.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
              break;
            case 'price-asc':
              filteredResults.sort((a, b) => a.price - b.price);
              break;
            case 'price-desc':
              filteredResults.sort((a, b) => b.price - a.price);
              break;
            default:
              break;
          }
          setSearchResults(filteredResults);
          setActiveTab('listings');
          setIsSearching(false);
        } catch (error) {
          console.error('Error searching products:', error);
          setIsSearching(false);
        }
      };
      fetchProducts();
    }
  }, [isSearching, searchQuery, category, sortOrder]);

  const handleSearch = (e) => {
    e.preventDefault();
    setIsSearching(true);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <SellerOverview />;
      case 'orders':
        return <SellerOrders />;
      case 'listings':
        return <SellerListings 
                 searchQuery={searchQuery} 
                 searchResults={searchResults} 
                 isSearching={isSearching} 
               />;
      case 'reports':
        return <SellerReports />;
      default:
        return <SellerOverview />;
    }
  };

  return (
    <div
      className="dashboard-bg d-flex"
      style={{
        backgroundImage: 'url(/images/coreui_1200_630.jpg)',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
        minHeight: '100vh'
      }}
    >
      {/* Sidebar */}
      <div className="bg-dark text-white" style={{ width: '200px',
    minHeight: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.09)', // 60% opaque black
    color: '#fff' }}>
        <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
  <Link to="http://localhost:3000/home" className="text-decoration-none">
    <h5 className="mb-0">Xaphora Dress</h5>
  </Link>
  <button className="btn btn-sm text-white">
    <i className="bi bi-list"></i>
  </button>
</div>
        <div className="mt-3">
          <div className="px-3 py-2 small text-muted">CORE</div>
          <div className="px-3 py-2 d-flex align-items-center">
            <i className="bi bi-speedometer2 me-2"></i> Dashboard
          </div>
          <div className="px-3 py-2 mt-3 small text-muted">STORE</div>
          <div className="px-3 py-2 d-flex align-items-center">
            <i className="bi bi-box me-2"></i> Products
          </div>
          <div className="px-3 py-2 d-flex align-items-center">
            <i className="bi bi-cart me-2"></i> Orders
          </div>
          <div className="px-3 py-2 d-flex align-items-center">
            <i className="bi bi-list me-2"></i> Categories
          </div>
          <div className="px-3 py-2 mt-3 small text-muted">ACCOUNTS</div>
          <div className="px-3 py-2 d-flex align-items-center">
            <i className="bi bi-people me-2"></i> Clients
          </div>
          <div className="px-3 py-2 d-flex align-items-center">
            <i className="bi bi-chat me-2"></i> Messages
          </div>
        </div>
        <div className="mt-auto p-3 border-top" style={{ position: 'absolute', bottom: 0, width: '200px' }}>
          <small>Logged in as:<br />John Smith</small>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-grow-1">
        {/* Top Navbar */}
        <nav className="navbar navbar-expand navbar-light bg-white border-bottom">
          <div className="container-fluid">
            <button className="navbar-toggler">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="d-flex ms-auto">
              <div className="input-group">
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Search for..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="btn btn-primary" onClick={handleSearch}>
                  <i className="bi bi-search"></i>
                </button>
              </div>
              <div className="dropdown ms-2">
                <button className="btn btn-light dropdown-toggle">
                  <i className="bi bi-person"></i>
                </button>
              </div>
            </div>
          </div>
        </nav>
        
        {/* Dashboard Content */}
        <div className="p-4">
          <h1 className="mb-1">Dashboard</h1>
          <p className="text-muted">Dashboard</p>
          
          {/* Product Search Card */}
          <div className="card mb-4">
            <div className="card-header bg-light d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Product Search</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSearch}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="input-group">
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Search products..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={isSearching}
                      >
                        {isSearching ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                            Searching...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-search me-1"></i> Search
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <select 
                      className="form-select"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
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
                      onChange={(e) => setSortOrder(e.target.value)}
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
          
          {/* Tab Navigation Card */}
          <div className="card mb-4">
            <div className="card-header bg-light">
              <ul className="nav nav-tabs card-header-tabs">
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
                    onClick={() => setActiveTab('overview')}
                  >
                    <i className="bi bi-bar-chart me-1"></i> Overview
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === 'orders' ? 'active' : ''}`}
                    onClick={() => setActiveTab('orders')}
                  >
                    <i className="bi bi-cart me-1"></i> Orders
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === 'listings' ? 'active' : ''}`}
                    onClick={() => setActiveTab('listings')}
                  >
                    <i className="bi bi-list-ul me-1"></i> Listings
                    {searchResults.length > 0 && (
                      <span className="badge bg-primary ms-1">{searchResults.length}</span>
                    )}
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === 'reports' ? 'active' : ''}`}
                    onClick={() => setActiveTab('reports')}
                  >
                    <i className="bi bi-file-earmark-bar-graph me-1"></i> Reports
                  </button>
                </li>
              </ul>
            </div>
            <div className="card-body">
              {renderContent()}
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <button className="btn btn-success me-2" onClick={() => navigate('/add-product')}>
                <i className="bi bi-plus-circle me-1"></i> Add Product
              </button>
              <button className="btn btn-primary" onClick={() => navigate('/products')}>
                <i className="bi bi-card-list me-1"></i> View Products
              </button>
            </div>
            <div>
            <button 
        className="btn btn-danger ms-2" 
        onClick={() => navigate('/api/auth/login')}
      >
        <i className="bi bi-box-arrow-right"></i> Logout
      </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SellerDashboard;
