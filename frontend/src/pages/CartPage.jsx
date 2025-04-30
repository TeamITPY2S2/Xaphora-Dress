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
        
        // Get user-specific cart from localStorage
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
    // Save to user-specific cart
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
    // Save to user-specific cart
    localStorage.setItem(`cart_${userId}`, JSON.stringify(updatedItems));
  };

  const calculateTotal = () => {
    const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const discount = loyaltyPointsToUse * 0.01; // 1 point = $0.01
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

    // Navigate to checkout page
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
    <div className="cart-container">
      <div className="cart-header">
        <h1>Your Shopping Cart</h1>
      </div>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-cart-icon">
            <i className="fas fa-shopping-cart"></i>
          </div>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added any items to your cart yet.</p>
          <button className="add-items-btn" onClick={handleAddMoreItems}>
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={`${item.productId}-${item.size}`} className="cart-item">
                <div className="item-image">
                  <img src={item.imageUrl} alt={item.productName} />
                </div>
                <div className="item-details">
                  <h3>{item.productName}</h3>
                  <div className="item-info">
                    <span className="size">Size: {item.size}</span>
                    <span className="price">LKR {item.price.toFixed(2)}</span>
                  </div>
                  <div className="quantity-controls">
                    <button 
                      className="quantity-btn"
                      onClick={() => handleQuantityChange(item.productId, item.size, -1)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button 
                      className="quantity-btn"
                      onClick={() => handleQuantityChange(item.productId, item.size, 1)}
                      disabled={item.quantity >= 10}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="item-subtotal">
                  <span>LKR {(item.price * item.quantity).toFixed(2)}</span>
                </div>
                <div className="item-actions">
                  <button 
                    className="delete-btn"
                    onClick={() => handleRemove(item.productId, item.size)}
                  >
                    <i className="fas fa-trash"></i>
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="summary-header">
              <h2>Order Summary</h2>
            </div>
            <div className="summary-content">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>LKR {cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping Fee:</span>
                <span>
                  {cartItems.reduce((total, item) => total + item.price * item.quantity, 0) >= 5000 ? (
                    <span style={{ color: "#4CAF50" }}>FREE</span>
                  ) : (
                    <>LKR 450.00</>
                  )}
                </span>
              </div>
              {cartItems.reduce((total, item) => total + item.price * item.quantity, 0) < 5000 && (
                <div className="summary-row" style={{ color: "#666", fontSize: "0.9em" }}>
                  <span>Add LKR {(5000 - cartItems.reduce((total, item) => total + item.price * item.quantity, 0)).toFixed(2)} more to get free shipping!</span>
                </div>
              )}
              {user && (
                <div className="loyalty-points-section">
                  <h3>Loyalty Points</h3>
                  <p>Available Points: {loyaltyPoints}</p>
                  <div className="points-input">
                    <label>Points to Use:</label>
                    <input
                      type="number"
                      min="0"
                      max={loyaltyPoints}
                      value={loyaltyPointsToUse}
                      onChange={(e) => setLoyaltyPointsToUse(Math.min(parseInt(e.target.value) || 0, loyaltyPoints))}
                    />
                  </div>
                  <p className="points-value">Value: ${(loyaltyPointsToUse * 0.01).toFixed(2)}</p>
                </div>
              )}
              <div className="summary-row total">
                <span>Total</span>
                <span>LKR {calculateTotal().toFixed(2)}</span>
              </div>
              <div className="summary-item points-earned">
                <span>Points to Earn:</span>
                <span>{Math.floor(calculateTotal() / 100)} points</span>
              </div>
            </div>
            <div className="summary-actions">
              <button className="continue-shopping" onClick={handleAddMoreItems}>
                Continue Shopping
              </button>
              <button className="checkout-btn" onClick={handleCheckout}>
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    <Footer />
    </>
  );
};

export default CartPage;
