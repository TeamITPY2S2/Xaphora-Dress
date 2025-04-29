// src/pages/ProductListPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ProductListPage.css';
import { FaShoppingCart } from 'react-icons/fa';

function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSize, setSelectedSize] = useState({});
  const [quantity, setQuantity] = useState({});
  const navigate = useNavigate();
  
  // Check if user is admin/seller
  const isAdmin = localStorage.getItem('userType') === 'admin' || localStorage.getItem('userType') === 'seller';

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8070/api/products');
      setProducts(response.data);
      
      // Initialize quantity for each product
      const initialQuantity = {};
      response.data.forEach(product => {
        initialQuantity[product._id] = 1;
      });
      setQuantity(initialQuantity);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // Filter products based on search term (case-insensitive)
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`http://localhost:8070/api/products/${id}`);
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleQuantityChange = (productId, delta) => {
    setQuantity(prev => {
      const newQuantity = prev[productId] + delta;
      return {
        ...prev,
        [productId]: newQuantity < 1 ? 1 : newQuantity > 10 ? 10 : newQuantity
      };
    });
  };

  const handleAddToCart = (product) => {
    const userId = localStorage.getItem("userId");
    
    if (!userId) {
      alert("Please login first!");
      navigate("/api/auth/login");
      return;
    }
    
    if (!selectedSize[product._id]) {
      alert("Please select a size first!");
      return;
    }
    
    const cartItem = {
      userId: userId,
      productId: product._id,
      productName: product.name,
      price: product.price,
      quantity: quantity[product._id],
      size: selectedSize[product._id],
      imageUrl: product.imageUrl,
    };
    
    // Get user-specific cart
    const userCart = JSON.parse(localStorage.getItem(`cart_${userId}`)) || [];
    
    // Check if item with same productId and size already exists
    const existingItemIndex = userCart.findIndex(
      item => item.productId === product._id && item.size === selectedSize[product._id]
    );

    if (existingItemIndex !== -1) {
      // Update quantity of existing item, capped at 10
      const newQuantity = Math.min(userCart[existingItemIndex].quantity + quantity[product._id], 10);
      userCart[existingItemIndex].quantity = newQuantity;
    } else {
      // Add new item
      userCart.push(cartItem);
    }
    
    // Save to user-specific cart
    localStorage.setItem(`cart_${userId}`, JSON.stringify(userCart));
    alert("Product added to cart!");
  };

  const handleCartPage = () => {
    navigate("/cart"); 
  }

  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

  return (
    <div className="product-list-container">
      <h2>All Products</h2>

      {/* Search bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by product name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Display filtered products */}
      <div className="product-list">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div className="product-card" key={product._id}>
              {product.imageUrl && (
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  style={{ width: '200px', height: 'auto', objectFit: 'cover' }}
                />
              )}
              <div className="product-info">
                <h3>{product.name}</h3>
                <p>Category: {product.category}</p>
                <p>Price: Rs {product.price.toFixed(2)}</p>
                <p>Stock: {product.stockQuantity}</p>
                <p>{product.description}</p>
                
                {!isAdmin && (
                  <>
                    <div className="size-selector">
                      <p>Select Size:</p>
                      <div className="size-buttons">
                        {sizes.map(size => (
                          <button
                            key={size}
                            className={`size-button ${selectedSize[product._id] === size ? 'selected' : ''}`}
                            onClick={() => setSelectedSize({...selectedSize, [product._id]: size})}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="quantity-selector">
                      <p>Quantity:</p>
                      <div className="quantity-buttons">
                        <button 
                          onClick={() => handleQuantityChange(product._id, -1)}
                          disabled={quantity[product._id] <= 1}
                        >
                          -
                        </button>
                        <span>{quantity[product._id]}</span>
                        <button 
                          onClick={() => handleQuantityChange(product._id, 1)}
                          disabled={quantity[product._id] >= 10}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    
                    <button 
                      className="add-to-cart-button"
                      onClick={() => handleAddToCart(product)}
                      disabled={!selectedSize[product._id]}
                    >
                      Add to Cart
                    </button>
                  </>
                )}
              </div>
              
              {isAdmin && (
                <div className="product-actions">
                  <button onClick={() => navigate(`/edit-product/${product._id}`)}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(product._id)}>
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No products found.</p>
        )}
      </div>

      {/* Fixed Checkout Button */}
      <div className="fixed-checkout-button" onClick={handleCartPage}>
        <FaShoppingCart />
        <span>Go to Checkout</span>
      </div>
    </div>
  );
}

export default ProductListPage;
