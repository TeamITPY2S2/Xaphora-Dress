import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { app } from '../firebase';
import { useSelector } from 'react-redux';
import { getStorage, uploadBytesResumable, ref, getDownloadURL } from 'firebase/storage';
import Swal from "sweetalert2";
import './css/addFinance.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

export default function AddFinancial() {
  const [imagePercent, setImagePercent] = useState(0);
  const fileRef1 = useRef(null);
  const [imageError, setImageError] = useState(false);
  const [image1, setImage1] = useState(undefined);
  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    userId: currentUser._id,
    productid: "",
    customerid: "",
    reviewText: "",
    reviewDate: "",
    averageRating: "",
    commentReview: "",
  });

  // Image upload handler
  useEffect(() => {
    if (image1) {
      handleFileUpload(image1, 'profilePicture');
    }
  }, [image1]);

  const handleFileUpload = async (image, field) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImagePercent(Math.round(progress));
      },
      (error) => {
        setImageError(true);
        setError('Image upload failed');
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData((prev) => ({
            ...prev,
            [field]: downloadURL,
          }));
        });
      }
    );
  };

  const handleImage1Click = () => {
    fileRef1.current.click();
  };

  // Form Validation
  const validateForm = () => {
    const errors = {};
    let formIsValid = true;

    // Check if each field is filled
    if (!formData.productid) {
      formIsValid = false;
      errors.productid = 'Product ID is required';
    }
    if (!formData.customerid) {
      formIsValid = false;
      errors.customerid = 'Customer ID is required';
    }
    if (!formData.reviewText) {
      formIsValid = false;
      errors.reviewText = 'Review Text is required';
    }
    if (!formData.reviewDate) {
      formIsValid = false;
      errors.reviewDate = 'Review Date is required';
    }
    if (!formData.averageRating) {
      formIsValid = false;
      errors.averageRating = 'Average Rating is required';
    }
    if (!formData.commentReview) {
      formIsValid = false;
      errors.commentReview = 'Comment Review is required';
    }
   
    if (formData.selectraiting <= 0) {
      formIsValid = false;
      errors.selectraiting = 'Select a rating between 1 and 5';
    }

    setFormErrors(errors);
    return formIsValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate form data
    if (!validateForm()) {
      return;
    }

    try {
      const res = await fetch('/api/clothauth/rating_store', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to create item');
      }

      Swal.fire({ icon: "success", title: "Success", text: "Successful" });
      navigate('/itemprofile');
    } catch (error) {
      setError('Something went wrong!');
      Swal.fire({ icon: "error", title: "Error", text: error.message || "Something went wrong." });
    }
  };

  // Handle Star Rating Click
  const handleStarRating = (rating) => {
    setFormData((prevData) => ({
      ...prevData,
      selectraiting: rating,
    }));
  };

  return (
    <div className="add-pet-container">
      <h1>Create Rating For Item</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            type="text"
            className={`form-control ${formErrors.productid ? 'is-invalid' : ''}`}
            placeholder="Product ID"
            onChange={(e) => setFormData({ ...formData, productid: e.target.value })}
          />
          {formErrors.productid && <div className="invalid-feedback">{formErrors.productid}</div>}
        </div>

        <div className="mb-3">
          <input
            type="text"
            className={`form-control ${formErrors.productid ? 'is-invalid' : ''}`}
            placeholder="Product Name"
            onChange={(e) => setFormData({ ...formData, productid: e.target.value })}
          />
          {formErrors.productid && <div className="invalid-feedback">{formErrors.productid}</div>}
        </div>

        <div className="mb-3">
          <input
            type="text"
            className={`form-control ${formErrors.customerid ? 'is-invalid' : ''}`}
            placeholder="Customer ID"
            onChange={(e) => setFormData({ ...formData, customerid: e.target.value })}
          />
          {formErrors.customerid && <div className="invalid-feedback">{formErrors.customerid}</div>}
        </div>

        <div className="mb-3">
          <textarea
            className={`form-control ${formErrors.reviewText ? 'is-invalid' : ''}`}
            placeholder="Review Text"
            onChange={(e) => setFormData({ ...formData, reviewText: e.target.value })}
          />
          {formErrors.reviewText && <div className="invalid-feedback">{formErrors.reviewText}</div>}
        </div>

        <div className="mb-3">
          <input
            type="date"
            className={`form-control ${formErrors.reviewDate ? 'is-invalid' : ''}`}
            placeholder="Review Date"
            onChange={(e) => setFormData({ ...formData, reviewDate: e.target.value })}
          />
          {formErrors.reviewDate && <div className="invalid-feedback">{formErrors.reviewDate}</div>}
        </div>

        <div className="mb-3">
          <input
            type="number"
            className={`form-control ${formErrors.averageRating ? 'is-invalid' : ''}`}
            placeholder="Average Rating"
            onChange={(e) => setFormData({ ...formData, averageRating: e.target.value })}
          />
          {formErrors.averageRating && <div className="invalid-feedback">{formErrors.averageRating}</div>}
        </div>

        <div className="mb-3">
          <input
            type="text"
            className={`form-control ${formErrors.commentReview ? 'is-invalid' : ''}`}
            placeholder="Comment Review"
            onChange={(e) => setFormData({ ...formData, commentReview: e.target.value })}
          />
          {formErrors.commentReview && <div className="invalid-feedback">{formErrors.commentReview}</div>}
        </div>


      
       

        <button id="submit-button" className="btn btn-success" type="submit">
          Submit
        </button><br /><br />
      </form>

      {error && <p>{error}</p>}
    </div>
  );
}
