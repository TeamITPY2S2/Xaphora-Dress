import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      navigate("/login");
      return;
    }
    
    // Get user-specific cart from localStorage
    const userCart = localStorage.getItem(`cart_${userId}`);
    setCartItems(userCart ? JSON.parse(userCart) : []);
    setLoading(false);
  }, [navigate]);

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

  const handleCheckout = () => {
    navigate("/checkout");
  };

  const handleAddMoreItems = () => {
    navigate("/products");
  };

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  if (loading) {
    return <p style={{ textAlign: "center", marginTop: "50px" }}>Loading cart...</p>;
  }

  return (
    <div className="cart-page" style={{ padding: "20px" }}>
      <h2>Your Cart</h2>

      {cartItems.length === 0 ? (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <p>No items in your cart.</p>
          <button
            onClick={handleAddMoreItems}
            style={{
              marginTop: "10px",
              padding: "10px 20px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "16px"
            }}
          >
            Add Items to Cart
          </button>
        </div>
      ) : (
        <>
          <table style={{ width: "100%", marginTop: "20px", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #ccc" }}>
                <th>Product</th>
                <th>Size</th>
                <th>Price (LKR)</th>
                <th>Quantity</th>
                <th>Subtotal (LKR)</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={`${item.productId}-${item.size || "default"}`}>
                  <td>{item.productName}</td>
                  <td>{item.size || "N/A"}</td>
                  <td>{item.price.toFixed(2)}</td>
                  <td>
                    <button
                      onClick={() => handleQuantityChange(item.productId, item.size, -1)}
                      disabled={item.quantity <= 1}
                      style={{
                        padding: "5px 10px",
                        margin: "0 5px",
                        cursor: item.quantity > 1 ? "pointer" : "not-allowed"
                      }}
                    >
                      -
                    </button>
                    {item.quantity}
                    <button
                      onClick={() => handleQuantityChange(item.productId, item.size, 1)}
                      disabled={item.quantity >= 10}
                      style={{
                        padding: "5px 10px",
                        margin: "0 5px",
                        cursor: item.quantity < 10 ? "pointer" : "not-allowed"
                      }}
                    >
                      +
                    </button>
                  </td>
                  <td>{(item.price * item.quantity).toFixed(2)}</td>
                  <td>
                    <button 
                      onClick={() => handleRemove(item.productId, item.size)}
                      style={{
                        padding: "5px 10px",
                        backgroundColor: "#ff4444",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer"
                      }}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3 style={{ textAlign: "right", marginTop: "20px" }}>
            Total: LKR {totalPrice.toFixed(2)}
          </h3>

          <div style={{ display: "flex", gap: "10px", marginTop: "20px", justifyContent: "center" }}>
            <button
              onClick={handleAddMoreItems}
              style={{
                padding: "10px 20px",
                backgroundColor: "#2196F3",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "16px"
              }}
            >
              Add More Items
            </button>

            <button
              onClick={handleCheckout}
              disabled={cartItems.length === 0}
              style={{
                padding: "10px 20px",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "16px"
              }}
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
