import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaShoppingCart } from 'react-icons/fa';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:8070/api/products/${id}`);
        setProduct(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch product details');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get('http://localhost:8070/api/cart', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const cart = response.data;
      const existingItem = cart.items.find(item => item.productId === id);

      if (existingItem) {
        await axios.put(`http://localhost:8070/api/cart/${cart._id}`, {
          items: cart.items.map(item =>
            item.productId === id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.put(`http://localhost:8070/api/cart/${cart._id}`, {
          items: [...cart.items, { productId: id, quantity: 1 }]
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      alert('Product added to cart successfully!');
    } catch (err) {
      console.error('Error adding to cart:', err);
      alert('Failed to add product to cart');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6">
          <img
            src={product.image}
            alt={product.name}
            className="img-fluid rounded"
          />
        </div>
        <div className="col-md-6">
          <h2>{product.name}</h2>
          <p className="text-muted">Category: {product.category}</p>
          <h3 className="text-primary">Rs {product.price}</h3>
          <p>{product.description}</p>
          <button
            className="btn btn-primary"
            onClick={handleAddToCart}
          >
            <FaShoppingCart /> Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails; 