import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../../style/RegisterLogin.css';
import { API_BASE_URL } from '../../config'; // Import baseUrl from config

const AddProduct = () => {
  const navigate = useNavigate(); // Add navigate hook
  const APP_URL= API_BASE_URL;
  
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    description: '',
    price: '',
    available_quantity: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateProductForm = () => {
    const newErrors = {};

    // Name validation - Fixed the validation logic
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) { // Fixed: was checking < 6 but error said 2
      newErrors.name = 'Name must be at least 2 characters long';
    }

    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 2) {
      newErrors.title = 'Title must be at least 2 characters long';
    }

    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters long';
    }

    // Price validation
    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Price must be a valid number greater than 0';
    }

    // Available quantity validation
    if (!formData.available_quantity) {
      newErrors.available_quantity = 'Available quantity is required';
    } else if (isNaN(formData.available_quantity) || parseInt(formData.available_quantity) < 0) {
      newErrors.available_quantity = 'Available quantity must be a valid number greater than or equal to 0';
    }

    return newErrors;
  };

  const handleProductSubmit = async (e) => { // Make function async
    e.preventDefault();
    setIsSubmitted(true);
    setIsLoading(true); // Set loading state

    const validationErrors = validateProductForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsLoading(false);
      Swal.fire({
        title: 'Validation Error',
        text: 'Please fix the errors in the form before submitting.',
        icon: 'error'
      });
      return;
    }

    try {
      // Fixed: Added await and proper error handling
      const response = await fetch(`${APP_URL}products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          // Add CSRF token if needed for Laravel
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify(formData)
      });

      // Fixed: Proper response handling
      if (response.ok) {
        const data = await response.json();
        setErrors({});
        
        Swal.fire({
          title: 'Product Added Successfully!', // Fixed: was saying "Updated"
          icon: 'success'
        }).then(() => {
          // Reset form
          setFormData({
            name: '',
            title: '',
            description: '',
            price: '',
            available_quantity: ''
          });
          setIsSubmitted(false);
          // Optionally navigate to products list
          // navigate('/products');
        });
      } else {
        // Fixed: Proper error data parsing
        const errorData = await response.json();
        
        // Handle Laravel validation errors
        if (response.status === 422 && errorData.errors) {
          setErrors(errorData.errors);
          Swal.fire({
            title: 'Validation Error',
            text: 'Please check the form for errors.',
            icon: 'error'
          });
        } else {
          Swal.fire({
            title: 'Error',
            text: errorData.message || 'Failed to add product',
            icon: 'error'
          });
        }
      }
    } catch (error) {
      console.error('Error adding product:', error);
      Swal.fire({
        title: 'Error',
        text: 'Network error. Please check your connection and try again.',
        icon: 'error'
      });
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  const getInputClass = (fieldName) => {
    let baseClass = 'form-input';
    
    if (isSubmitted) {
      if (errors[fieldName]) {
        baseClass += ' error';
      } else if (formData[fieldName] && formData[fieldName].toString().trim()) {
        baseClass += ' success';
      }
    }
    
    return baseClass;
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Add Your Product</h2>
        <p>Fill in the details to add a new product.</p>
        
        <form onSubmit={handleProductSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="productName">
              Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="productName"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={getInputClass('name')}
              placeholder="Enter your product name"
              disabled={isLoading}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="productTitle">
              Title <span className="required">*</span> {/* Fixed: was showing "Name" */}
            </label>
            <input
              type="text"
              id="productTitle"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={getInputClass('title')}
              placeholder="Enter your product title"
              disabled={isLoading}
            />
            {errors.title && <span className="error-message">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="productDescription">
              Description <span className="required">*</span>
            </label>
            <textarea /* Changed to textarea for better UX */
              id="productDescription"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={getInputClass('description')}
              placeholder="Enter your product description"
              rows="4"
              disabled={isLoading}
            />
            {errors.description && <span className="error-message">{errors.description}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="productPrice">
              Price <span className="required">*</span>
            </label>
            <input  
              type="number"
              id="productPrice"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className={getInputClass('price')}
              placeholder="Enter your product price"
              step="0.01"
              min="0.01"
              disabled={isLoading}
            />
            {errors.price && <span className="error-message">{errors.price}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="productAvailableQuantity">
              Available Quantity <span className="required">*</span>
            </label>
            <input
              type="number"
              id="productAvailableQuantity"
              name="available_quantity"
              value={formData.available_quantity}
              onChange={handleChange}
              className={getInputClass('available_quantity')}
              placeholder="Enter available quantity"
              min="0"
              disabled={isLoading}
            />
            {errors.available_quantity && <span className="error-message">{errors.available_quantity}</span>}   
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-block"
            disabled={isLoading}
          >
            {isLoading ? 'Adding Product...' : 'Add Product'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;