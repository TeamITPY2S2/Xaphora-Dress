import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    // Load cart from localStorage instead of API
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCart);
    setLoading(false);
  }, []);

  const handleQuantityChange = (productId, delta) => {
    const updatedItems = cartItems.map((item) => {
      if (item.productId === productId) {
        const newQuantity = item.quantity + delta;
        return {
          ...item,
          quantity: newQuantity < 1 ? 1 : newQuantity > 10 ? 10 : newQuantity,
        };
      }
      return item;
    });
    setCartItems(updatedItems);
    localStorage.setItem("cart", JSON.stringify(updatedItems));
  };

  const handleRemove = (productId) => {
    const updatedItems = cartItems.filter((item) => item.productId !== productId);
    setCartItems(updatedItems);
    localStorage.setItem("cart", JSON.stringify(updatedItems));
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    navigate("/checkout");
  };

  const handleAddMoreItems = () => {
    navigate("/products");
  };

  if (loading) {
    return <p>Loading cart...</p>;
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
          <table style={{ width: "100%", marginBottom: "20px" }}>
            <thead>
              <tr>
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
                <tr key={item.productId}>
                  <td>{item.productName}</td>
                  <td>{item.size || "N/A"}</td>
                  <td>{item.price.toFixed(2)}</td>
                  <td>
                    <button
                      onClick={() => handleQuantityChange(item.productId, -1)}
                      disabled={item.quantity <= 1}
                      style={{
                        padding: "5px 10px",
                        margin: "0 5px",
                        cursor: "pointer"
                      }}
                    >
                      -
                    </button>
                    {item.quantity}
                    <button
                      onClick={() => handleQuantityChange(item.productId, 1)}
                      disabled={item.quantity >= 10}
                      style={{
                        padding: "5px 10px",
                        margin: "0 5px",
                        cursor: "pointer"
                      }}
                    >
                      +
                    </button>
                  </td>
                  <td>{(item.price * item.quantity).toFixed(2)}</td>
                  <td>
                    <button 
                      onClick={() => handleRemove(item.productId)}
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

          <h3>Total: LKR {totalPrice.toFixed(2)}</h3>

          <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
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
