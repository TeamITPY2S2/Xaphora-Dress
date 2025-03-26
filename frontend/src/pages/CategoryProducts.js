import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CategoryProducts.css';
import { FaShoppingCart } from 'react-icons/fa';

const CategoryProducts = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8070/api/products/category/${categoryId}`);
        setProducts(response.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching category products:', error);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId]);

  const handleAddToCart = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      // Get or create cart
      const response = await axios.get('http://localhost:8070/api/cart', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.data) {
        throw new Error('No cart data received from server');
      }

      // Ensure we have a single cart object
      const cart = Array.isArray(response.data) ? response.data[0] : response.data;
      console.log('Cart response:', cart); // Debug log

      if (!cart || !cart._id) {
        throw new Error('Cart ID is missing from server response');
      }

      const existingItem = cart.items?.find(item => item.productId === productId);
      const product = products.find(p => p._id === productId);

      if (!product) {
        throw new Error('Product not found');
      }

      const updatedItems = existingItem
        ? cart.items.map(item =>
            item.productId === productId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [...(cart.items || []), { 
            productId, 
            quantity: 1, 
            price: product.price,
            name: product.name,
            image: product.image
          }];

      // Calculate total price
      const totalPrice = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      // Update cart with new items
      const updateResponse = await axios.put(`http://localhost:8070/api/cart/${cart._id}`, {
        items: updatedItems,
        totalPrice
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!updateResponse.data) {
        throw new Error('Failed to update cart');
      }

      alert('Product added to cart successfully!');
    } catch (err) {
      console.error('Error adding to cart:', err);
      if (err.response?.status === 401) {
        // Token is invalid or expired
        localStorage.removeItem('token');
        navigate('/login');
      } else if (err.response?.data?.error) {
        alert(`Failed to add product to cart: ${err.response.data.error}`);
      } else {
        alert(err.message || 'Failed to add product to cart. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error">{error}</div>
        <button className="retry-button" onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="category-products-container">
      <h2 className="category-title">Category Products</h2>
      <div className="products-grid">
        {products.map((product) => (
          <div key={product._id} className="product-card">
            <img
              src={product.image}
              alt={product.name}
              className="product-image"
            />
            <div className="product-info">
              <h3>{product.name}</h3>
              <p className="price">Rs {product.price}</p>
              <button
                className="add-to-cart-btn"
                onClick={() => handleAddToCart(product._id)}
              >
                <FaShoppingCart /> Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryProducts; 