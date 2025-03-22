// src/components/SellerReports.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';

function SellerReports() {
  const [products, setProducts] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Fetch the list of products once the component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Replace the endpoint with your seller-specific endpoint if needed
        const response = await axios.get('http://localhost:8070/api/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    try {
      // Simulate a delay if needed (or remove this in production)
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Create CSV header
      let csvContent = 'Product Name,Category,Price,Stock,Created At\n';

      // Append each product's data
      products.forEach((product) => {
        csvContent += `"${product.name}","${product.category}",${product.price},${product.stockQuantity},"${new Date(product.createdAt).toLocaleDateString()}"\n`;
      });

      // Create a Blob with CSV data and trigger download using file-saver
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, 'products_report.csv');
    } catch (error) {
      console.error('Error generating report:', error);
    }
    setIsGenerating(false);
  };

  return (
    <div className="p-3">
      <h4>Generate Products Report</h4>
      <p>
        Click the button below to generate a CSV report of your products.
      </p>
      <button
        className="btn btn-primary"
        onClick={handleGenerateReport}
        disabled={isGenerating || products.length === 0}
      >
        {isGenerating ? (
          <>
            <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
            Generating...
          </>
        ) : (
          'Generate Report'
        )}
      </button>
    </div>
  );
}

export default SellerReports;
