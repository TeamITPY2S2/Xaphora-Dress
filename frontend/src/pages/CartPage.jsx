import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [cartId, setCartId] = useState(null);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (userId) {
      fetchCart();
    }
  }, [userId]);

  const fetchCart = async () => {
    try {
      const res = await axios.get(`http://localhost:8070/api/cart/user/${userId}`);
      if (res.data) {
        setCartItems(res.data.items || []);
        setCartId(res.data._id); // Save the cart id
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = async (productId, delta) => {
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

    try {
      await axios.put(`http://localhost:8070/api/cart/${cartId}`, { items: updatedItems });
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  const handleRemove = async (productId) => {
    const updatedItems = cartItems.filter((item) => item.productId !== productId);
    setCartItems(updatedItems);

    try {
      await axios.put(`http://localhost:8070/api/cart/${cartId}`, { items: updatedItems });
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    navigate("/checkout");
  };

  if (loading) {
    return <p>Loading cart...</p>;
  }

  return (
    <div className="cart-page" style={{ padding: "20px" }}>
      <h2>Your Cart</h2>

      {cartItems.length === 0 ? (
        <p>No items in your cart.</p>
      ) : (
        <>
          <table style={{ width: "100%", marginBottom: "20px" }}>
            <thead>
              <tr>
                <th>Product</th>
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
                  <td>{item.price.toFixed(2)}</td>
                  <td>
                    <button
                      onClick={() => handleQuantityChange(item.productId, -1)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>{" "}
                    {item.quantity}{" "}
                    <button
                      onClick={() => handleQuantityChange(item.productId, 1)}
                      disabled={item.quantity >= 10}
                    >
                      +
                    </button>
                  </td>
                  <td>{(item.price * item.quantity).toFixed(2)}</td>
                  <td>
                    <button onClick={() => handleRemove(item.productId)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3>Total: LKR {totalPrice.toFixed(2)}</h3>

          <button
            onClick={handleCheckout}
            disabled={cartItems.length === 0}
            style={{ marginTop: "20px" }}
          >
            Proceed to Checkout
          </button>
        </>
      )}
    </div>
  );
};

export default CartPage;
