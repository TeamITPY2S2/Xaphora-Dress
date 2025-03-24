// src/components/SellerListings.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './SellerListings.css';

function SellerListings() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch products from the backend
    axios.get('http://localhost:8070/api/products')
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      });
  }, []);

  const handleEdit = (id) => {
    navigate(`/edit-product/${id}`);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      axios.delete(`http://localhost:8070/api/products/${id}`)
        .then(() => {
          setProducts(products.filter(product => product._id !== id));
        })
        .catch(error => {
          console.error('Error deleting product:', error);
        });
    }
  };

  return (
    <div className="seller-listings">
      <h2>Product Listings</h2>
      <div className="listings-container">
        {products.length > 0 ? (
          products.map(product => (
            <div className="listing-card" key={product._id}>
              <img src={product.imageUrl} alt={product.name} />
              <div className="listing-info">
                <h3>{product.name}</h3>
                <p>Category: {product.category}</p>
                <p>Price: ${product.price}</p>
                <p>Stock: {product.stockQuantity}</p>
              </div>
              <div className="listing-actions">
                <button onClick={() => handleEdit(product._id)}>Edit</button>
                <button onClick={() => handleDelete(product._id)}>Delete</button>
              </div>
            </div>
          ))
        ) : (
          <p>No products available.</p>
        )}
      </div>
    </div>
  );
}

export default SellerListings;
