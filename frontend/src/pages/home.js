import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './home.css';
import XaphoraChatbot from './XaphoraChatbot';
import AccountDrawer from '../components/AccountDrawer';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

// ============================================
// HERO CONFIG - Easy to update for seasons/festivals
// ============================================
// HOW TO UPDATE:
// 1. headline: Main big text (e.g., "SUMMER SALE", "NEW ARRIVALS", "DIWALI SPECIAL")
// 2. promoLines: Array of promo messages. Each line has:
//    - prefix: Text before the highlighted amount
//    - highlight: The amount/percentage to highlight in RED
//    - suffix: Text after highlight, before discount
//    - discount: The discount text (also highlighted in RED)
// 3. codes: Array of promo codes to display
// 4. heroImage: Path to the hero image (place in public/images/)
// 5. ctaText & ctaLink: Button text and where it links to
// ============================================
const HERO_CONFIG = {
  headline: "XAPHORA DRESS",
  promoLines: [
    { 
      prefix: "Your Style,", 
      highlight: "Your Story", 
      suffix: "-", 
      discount: "Shop Now" 
    },
    { 
      prefix: "Fashion for", 
      highlight: "Everyone", 
      suffix: "in the", 
      discount: "Family" 
    }
  ],
  codes: [], // Empty for now - add promo codes like ["CODE10", "CODE20"] when needed
  heroImage: "/images/main-image.JPEG",
  ctaText: "EXPLORE COLLECTION",
  ctaLink: "/products"
};

const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const token = localStorage.getItem('token');
  const userType = localStorage.getItem('userType');
  const userName = localStorage.getItem('userName');

  useEffect(() => {
    fetchNewArrivals();
  }, []);

  const fetchNewArrivals = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8070/api/products');
      const sortedProducts = response.data
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
      setNewArrivals(sortedProducts);
      setError(null);
    } catch (err) {
      console.error('Error fetching new arrivals:', err);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileClick = () => {
    if (token) setDrawerOpen(true);
    else navigate('/api/auth/login');
  };

  const handleAccountDetails = () => navigate('/dashboard');
  const handleAddresses = () => navigate('/addresses');
  const handleChangePassword = () => navigate('/change-password');
  const handleUpdateProfile = () => navigate('/update-profile');

  const handleDeleteProfile = async () => {
    if (!window.confirm("Are you sure you want to delete your profile?")) return;
    try {
      const res = await fetch("http://localhost:8070/api/users", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        alert("Your account has been deleted successfully.");
        handleLogout();
      } else {
        alert(data.message || "Failed to delete your account.");
      }
    } catch (err) {
      console.error("Error deleting profile:", err);
      alert("Error deleting your profile.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    navigate("/home");
  };

  const categories = [
    { id: 1, title: "Women's Fashion", image: '/images/women-fashion.webp' },
    { id: 2, title: "Men's Collection", image: '/images/mensfassion.avif' },
    { id: 3, title: "Kids & Baby", image: '/images/baby.avif' },
  ];

  const cakeProducts = [
    { id: 1, title: "Birthday Cakes", image: '/images/birthday-cake.jpeg', description: "Custom designs for memorable celebrations" },
    { id: 2, title: "Wedding Cakes", image: '/images/wedding-cake.jpeg', description: "Elegant creations for your special day" },
    { id: 3, title: "Bride-to-be Cakes", image: '/images/bridal-cake.jpeg', description: "Perfect for bridal showers & bachelorettes" },
  ];

  return (
    <div className="container">
      <div className="main-wrapper">
        <Navbar />

        {/* Hero Section - Carnage Style */}
        <section className="hero-section">
          <div className="hero-container">
            <div className="hero-content">
              {/* Main Headline */}
              <h1 className="hero-headline">{HERO_CONFIG.headline}</h1>
              
              {/* Promo Lines */}
              <div className="hero-promo-text">
                {HERO_CONFIG.promoLines.map((line, idx) => (
                  <p key={idx} className="promo-line">
                    <span className="promo-prefix">{line.prefix} </span>
                    <span className="promo-highlight">{line.highlight}</span>
                    <span className="promo-prefix"> {line.suffix} </span>
                    <span className="promo-discount">{line.discount}</span>
                  </p>
                ))}
              </div>
              
              {/* Promo Codes */}
              <div className="hero-codes">
                <span className="code-label">USE CODE - </span>
                {HERO_CONFIG.codes.map((code, idx) => (
                  <span key={code}>
                    {idx > 0 && <span className="code-separator"> | </span>}
                    <span className="code-value">{code}</span>
                  </span>
                ))}
              </div>

              {/* CTA Button */}
              <Link to={HERO_CONFIG.ctaLink} className="hero-cta-btn">
                {HERO_CONFIG.ctaText}
              </Link>
            </div>
            
            {/* Hero Image */}
            <div className="hero-image-wrapper">
              <img 
                src={HERO_CONFIG.heroImage} 
                alt="Featured collection" 
                className="hero-image"
              />
            </div>
          </div>
        </section>

        {/* Featured Categories */}
        <section className="featured-categories">
          <div className="section-header">
            <h2 className="section-title">Explore Fashion Collections</h2>
            <p className="section-subtitle">Discover style for everyone in the family</p>
          </div>
          <div className="category-grid">
            {categories.map((cat) => (
              <div key={cat.id} className="category-card">
                <div className="category-image-container">
                  <img src={cat.image} alt={cat.title} className="category-image" />
                </div>
                <div className="category-content">
                  <h3 className="category-title">{cat.title}</h3>
                  <Link to={`/category/${cat.id}`} className="shop-now-btn">Shop Now</Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Cakes Section */}
        <section className="cakes-section">
          <div className="section-header">
            <h2 className="section-title">Sweet Treats by Xaphora</h2>
            <p className="section-subtitle">Custom cakes for every celebration</p>
          </div>
          <div className="cakes-grid">
            {cakeProducts.map((cake) => (
              <div key={cake.id} className="cake-card">
                <div className="cake-image-container">
                  <img src={cake.image} alt={cake.title} className="cake-image" />
                </div>
                <div className="cake-content">
                  <h3 className="cake-title">{cake.title}</h3>
                  <p className="cake-description">{cake.description}</p>
                  <Link to="/cakes" className="order-cake-btn">Order Now</Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* New Arrivals */}
        <section className="new-arrivals-section">
          <div className="section-header">
            <h2 className="section-title">New Arrivals</h2>
            <Link to="/products" className="view-all">View All</Link>
          </div>

          {loading ? (
            <div className="loading">Loading products...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : (
            <div className="products-grid">
              {newArrivals.map((prod) => (
                <div key={prod._id} className="product-card">
                  <Link to={`/product/${prod._id}`} className="product-link">
                    <div className="product-image-container">
                      <img
                        src={prod.imageUrl || prod.image}
                        alt={prod.name}
                        className="product-image"
                      />
                    </div>
                    <div className="product-info">
                      <h3 className="product-name">{prod.name}</h3>
                      <p className="product-price">Rs {prod.price.toFixed(2)}</p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Chatbot */}
        <XaphoraChatbot />

        
        <Footer />
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
        
      </div>
    </div>
  );
};

export default Home;