import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './home.css';
import { FaSearch, FaShoppingCart, FaUser, FaHeart, FaBars } from 'react-icons/fa';
import XaphoraChatbot from './XaphoraChatbot';
import AccountDrawer from '../components/AccountDrawer';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

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
    { id: 1, title: "Women's Fashion", image: '/images/womenf.webp' },
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

        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-slider">
            <div className="hero-slide">
              <video className="background-video" autoPlay loop muted playsInline>
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
            {categories.map((cat) => (
              <div key={cat.id} className="category-card">
                <img src={cat.image} alt={cat.title} className="category-image" />
                <div className="category-content">
                  <h2 className="category-title">{cat.title}</h2>
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