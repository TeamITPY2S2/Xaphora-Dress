// src/pages/ProductListPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ProductListPage.css';

function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('http://localhost:8070/api/products');
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

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

  // Filter products based on search term (case-insensitive)
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">All Products</h2>
        <button 
          className="btn btn-success"
          onClick={() => navigate('/add-product')}
        >
          + Add New
        </button>
      </div>

      {/* Search bar */}
      <div className="mb-4">
        <input
          type="text"
          className="form-control search-input"
          placeholder="Search by product name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Display filtered products */}
      <div className="row">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div className="col-md-4 mb-4" key={product._id}>
              <div className="card h-100 shadow-sm">
                {product.imageUrl && (
                  <img
                    src={product.imageUrl}
                    className="card-img-top product-img"
                    alt={product.name}
                  />
                )}
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text mb-1"><strong>Category:</strong> {product.category}</p>
                  <p className="card-text mb-1"><strong>Price:</strong> ${product.price}</p>
                  <p className="card-text mb-1"><strong>Stock:</strong> {product.stockQuantity}</p>
                  <p className="card-text flex-grow-1">{product.description}</p>
                  <div className="mt-3 d-flex justify-content-between">
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => navigate(`/edit-product/${product._id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(product._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12">
            <p className="text-center text-muted">No products found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductListPage;
