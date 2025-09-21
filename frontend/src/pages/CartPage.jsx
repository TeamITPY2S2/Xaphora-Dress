// src/pages/CartPage.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CartPage.css";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [loyaltyPointsToUse, setLoyaltyPointsToUse] = useState(0);

  useEffect(() => {
    const initializeCart = async () => {
      try {
        setLoading(true);
        const userId = localStorage.getItem("userId");
        if (!userId) {
          navigate("/login");
          return;
        }
        const userCart = localStorage.getItem(`cart_${userId}`);
        const cartData = userCart ? JSON.parse(userCart) : [];
        setCartItems(cartData);
      } catch (error) {
        console.error("Error initializing cart:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeCart();
  }, [navigate]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.get('/api/users/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(response.data);
          setLoyaltyPoints(response.data.loyaltyPoints || 0);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleQuantityChange = (productId, size, delta) => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      navigate("/login");
      return;
    }

    const updatedItems = cartItems.map((item) => {
      if (item.productId === productId && item.size === size) {
        const newQuantity = item.quantity + delta;
        return {
          ...item,
          quantity: Math.max(1, Math.min(newQuantity, 10)),
        };
      }
      return item;
    });

    setCartItems(updatedItems);
    localStorage.setItem(`cart_${userId}`, JSON.stringify(updatedItems));
  };

  const handleRemove = (productId, size) => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      navigate("/login");
      return;
    }

    const updatedItems = cartItems.filter(
      (item) => !(item.productId === productId && item.size === size)
    );

    setCartItems(updatedItems);
    localStorage.setItem(`cart_${userId}`, JSON.stringify(updatedItems));
  };

  const calculateTotal = () => {
    const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const discount = loyaltyPointsToUse * 0.01;
    const shippingFee = subtotal >= 5000 ? 0 : 450;
    return Math.max(0, subtotal - discount + shippingFee);
  };

  const handleCheckout = () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      navigate('/login', { state: { from: '/cart' } });
      return;
    }
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    navigate('/checkout');
  };

  const handleAddMoreItems = () => {
    navigate("/home");
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your cart...</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="cart-page">
        <header className="cart-header">
          <h1>Your Shopping Cart</h1>
        </header>

        <div className="cart-content">
          {/* If cart empty */}
          {cartItems.length === 0 ? (
            <section className="cart-section empty-cart">
              <h3>Cart Overview</h3>
              <p>Your cart is empty</p>
              <button onClick={handleAddMoreItems} className="shop-now-btn">
                Start Shopping
              </button>
            </section>
          ) : (
            <>
              {/* Cart Items */}
              <section className="cart-section cart-items">
                <h3>Cart Items</h3>
                {cartItems.map((item) => (
                  <div key={`${item.productId}-${item.size}`} className="cart-item">
                    <div className="item-image">
                      <img src={item.imageUrl} alt={item.productName} />
                    </div>
                    <div className="item-details">
                      <h4>{item.productName}</h4>
                      <p>Size: {item.size}</p>
                      <p>LKR {item.price.toFixed(2)}</p>
                      <div className="quantity-controls">
                        <button onClick={() => handleQuantityChange(item.productId, item.size, -1)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => handleQuantityChange(item.productId, item.size, 1)}>+</button>
                      </div>
                    </div>
                    <div className="item-actions">
                      <button onClick={() => handleRemove(item.productId, item.size)} className="remove-btn">
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </section>

              {/* Order Summary */}
              <section className="cart-section cart-summary">
                <h3>Order Summary</h3>
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>LKR {cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <span>{calculateTotal() >= 5000 ? "FREE" : "LKR 450"}</span>
                </div>
                <div className="summary-row total">
                  <span>Total</span>
                  <span>LKR {calculateTotal().toFixed(2)}</span>
                </div>
                <button className="checkout-btn" onClick={handleCheckout}>
                  Proceed to Checkout
                </button>
              </section>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CartPage;