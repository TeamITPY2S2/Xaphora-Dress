import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './home.css';
import { FaSearch, FaShoppingCart, FaUser, FaHeart, FaBars } from 'react-icons/fa';
import XaphoraChatbot from './XaphoraChatbot';

// AccountLink component: Redirects guests to login and logged in users to dashboard.
const AccountLink = () => {
  const token = localStorage.getItem("token");
  const userType = localStorage.getItem("userType");

  let route = "/api/auth/login"; // default to login

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



const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products when component mounts
  useEffect(() => {
    fetchNewArrivals();
  }, []);

  const fetchNewArrivals = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8070/api/products');
      // Sort by date and take the latest products
      const sortedProducts = response.data
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5); // Take only the 5 most recent products
      setNewArrivals(sortedProducts);
      setError(null);
    } catch (error) {
      console.error('Error fetching new arrivals:', error);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  // Sample data for featured categories
  const categories = [
    {
      id: 1,
      title: "Women's Fashion",
      image: '/images/womenf.webp',
    },
    {
      id: 2,
      title: "Men's Collection",
      image: '/images/mensfassion.avif',
    },
    {
      id: 3,
      title: "Kids & Baby",
      image: '/images/baby.avif',
    }
  ];

  return (
    <div className="container">
      <div className="main-wrapper">
        
        {/* Top Bar */}
        <div className="top-bar">
          Free shipping on orders over Rs 5000
        </div>

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
              {/* Use AccountLink to conditionally route to login or dashboard */}
              <AccountLink isAuthenticated={isAuthenticated} />
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

        {/* Hero Section */}
        <section className="hero-section">
  <div className="hero-slider">
    <div className="hero-slide">
      {/* Background video */}
      <video 
        className="background-video" 
        autoPlay 
        loop 
        muted 
        playsInline
      >
        <source src="/images/fashion2.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="hero-content">
        <h1 className="hero-title">New Season Arrivals</h1>
        <p className="hero-subtitle">Discover the latest trends in fashion</p>
        <Link to="/shop" className="shop-now-btn">Shop Now</Link>
      </div>
    </div>
  </div>
</section>


        {/* Featured Categories */}
        <section className="featured-categories">
          <div className="category-grid">
            {categories.map((category) => (
              <div key={category.id} className="category-card">
                <img
                  src={category.image}
                  alt={category.title}
                  className="category-image"
                />
                <div className="category-content">
                  <h2 className="category-title">{category.title}</h2>
                  <Link to={`/category/${category.id}`} className="shop-now-btn">
                    Shop Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* New Arrivals */}
        <section className="new-arrivals-section">
          <div className="section-header">
            <h2 className="section-title">New Arrivals</h2>
            <Link to="/products" className="view-all">
              View All
            </Link>
          </div>

          {loading ? (
            <div className="loading">Loading products...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : (
            <div className="products-grid">
              {newArrivals.map((product) => (
                <div key={product._id} className="product-card">
                  <Link to={`/product/${product._id}`} className="product-link">
                    <div className="product-image-container">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="product-image"
                      />
                    </div>
                    <div className="product-info">
                      <h3 className="product-name">{product.name}</h3>
                      <p className="product-price">Rs {product.price.toFixed(2)}</p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>

        <XaphoraChatbot/>

        {/* Footer */}
        <footer className="footer">
          <div className="footer-content">
            <div className="footer-column">
              <h3>Company</h3>
              <Link to="/about" className="footer-link">About Us</Link>
              <Link to="/contact" className="footer-link">Contact Us</Link>
              <Link to="/careers" className="footer-link">Careers</Link>
            </div>
            <div className="footer-column">
              <h3>Help</h3>
              <Link to="/shipping" className="footer-link">Shipping Information</Link>
              <Link to="/returns" className="footer-link">Returns & Exchanges</Link>
              <Link to="/faq" className="footer-link">FAQ</Link>
            </div>
            <div className="footer-column">
              <h3>Shop</h3>
              <Link to="/women" className="footer-link">Women's Fashion</Link>
              <Link to="/men" className="footer-link">Men's Fashion</Link>
              <Link to="/kids" className="footer-link">Kids & Baby</Link>
            </div>
            <div className="footer-column">
              <h3>Contact</h3>
              <p>Email: support@xaphoradress.com</p>
              <p>Phone: (555) 123-4567</p>
              <p>Address: 123 Fashion Street</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;

