import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './EditProductPage.css';

export default function EditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: '',
    category: '',
    price: '',
    stockQuantity: '',
    imageUrl: '',
    description: ''
  });
  const [newImage, setNewImage] = useState(null);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({ price: '', stockQuantity: '' });

  useEffect(() => {
    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProduct = async () => {
    try {
      const { data } = await axios.get(`http://localhost:8070/api/products/${id}`);
      setProduct({
        name: data.name,
        category: data.category,
        price: data.price.toString(),
        stockQuantity: data.stockQuantity.toString(),
        imageUrl: data.imageUrl,
        description: data.description
      });
    } catch (err) {
      console.error('Error fetching product:', err);
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;

    if (name === 'price') {
      if (value === '' || (/^\d+(\.\d{0,2})?$/.test(value) && parseFloat(value) >= 0)) {
        setErrors(err => ({ ...err, price: '' }));
      } else {
        setErrors(err => ({ ...err, price: 'Price must be a non-negative number' }));
      }
      setProduct(prod => ({ ...prod, price: value }));
      return;
    }

    if (name === 'stockQuantity') {
      if (value === '' || (/^\d+$/.test(value) && parseInt(value, 10) >= 0)) {
        setErrors(err => ({ ...err, stockQuantity: '' }));
      } else {
        setErrors(err => ({ ...err, stockQuantity: 'Quantity must be a non-negative integer' }));
      }
      setProduct(prod => ({ ...prod, stockQuantity: value }));
      return;
    }

    setProduct(prod => ({ ...prod, [name]: value }));
  };

  const handleImageChange = e => {
    if (e.target.files?.[0]) {
      setNewImage(e.target.files[0]);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (errors.price || errors.stockQuantity) {
      setMessage('Please fix the validation errors before submitting.');
      return;
    }
    if (product.price === '' || product.stockQuantity === '') {
      setMessage('Price and Stock Quantity cannot be empty.');
      return;
    }

    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('category', product.category);
    formData.append('price', product.price);
    formData.append('stockQuantity', product.stockQuantity);
    formData.append('description', product.description);
    if (newImage) formData.append('image', newImage);

    try {
      const res = await axios.put(
        `http://localhost:8070/api/products/${id}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      setMessage(res.data.message);
      setTimeout(() => navigate('/products'), 1500);
    } catch (err) {
      console.error(err);
      setMessage('Error updating product');
    }
  };

  return (
    <div className="container py-5">
      <div className="card shadow-lg mx-auto edit-product-card">
        <div className="card-body px-5 py-4">
          <h2 className="card-title mb-4 text-center">Edit Product</h2>

          {message && (
            <div className={`alert ${errors.price || errors.stockQuantity ? 'alert-danger' : 'alert-success'}`} role="alert">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Name</label>
              <input
                id="name"
                className="form-control"
                type="text"
                name="name"
                value={product.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Category */}
            <div className="mb-3">
              <label htmlFor="category" className="form-label">Category</label>
              <input
                id="category"
                className="form-control"
                type="text"
                name="category"
                value={product.category}
                onChange={handleChange}
                required
              />
            </div>

            <div className="row">
              {/* Price */}
              <div className="col-md-6 mb-3">
                <label htmlFor="price" className="form-label">Price</label>
                <input
                  id="price"
                  className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                  type="number"
                  name="price"
                  min="0"
                  step="0.01"
                  value={product.price}
                  onChange={handleChange}
                  required
                />
                {errors.price && <div className="invalid-feedback">{errors.price}</div>}
              </div>

              {/* Stock Quantity */}
              <div className="col-md-6 mb-3">
                <label htmlFor="stockQuantity" className="form-label">Stock Quantity</label>
                <input
                  id="stockQuantity"
                  className={`form-control ${errors.stockQuantity ? 'is-invalid' : ''}`}
                  type="number"
                  name="stockQuantity"
                  min="0"
                  value={product.stockQuantity}
                  onChange={handleChange}
                  required
                />
                {errors.stockQuantity && (
                  <div className="invalid-feedback">{errors.stockQuantity}</div>
                )}
              </div>
            </div>

            {/* Current Image */}
            {product.imageUrl && (
              <div className="mb-3 text-center">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="img-fluid rounded current-image"
                />
              </div>
            )}

            {/* Change Image */}
            <div className="mb-3">
              <label htmlFor="image" className="form-label">Change Image</label>
              <input
                id="image"
                className="form-control"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>

            {/* Description */}
            <div className="mb-4">
              <label htmlFor="description" className="form-label">Description</label>
              <textarea
                id="description"
                className="form-control"
                name="description"
                rows="4"
                value={product.description}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg w-100"
              disabled={!!errors.price || !!errors.stockQuantity}
            >
              Update Product
            </button>
          </form>
        </div>
      </div>
    </div>
);
}
