import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../../style/RegisterLogin.css';
import { API_BASE_URL } from '../../config'; // Import baseUrl from config

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
    const APP_URL = API_BASE_URL;
  
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    description: '',
    price: '',
    available_quantity: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`${APP_URL}products/${id}`);
      if (response.ok) {
        const product = await response.json();
        setFormData({
          name: product.name || '',
          title: product.title || '',
          description: product.description || '',
          price: product.price || '',
          available_quantity: product.available_quantity || ''
        });
      } else {
        Swal.fire({
          title: 'Error',
          text: 'Product not found',
          icon: 'error'
        });
        navigate('/products');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to fetch product details',
        icon: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

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

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
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

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    const validationErrors = validateProductForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      Swal.fire({
        title: 'Validation Error',
        text: 'Please fix the errors in the form before submitting.',
        icon: 'error'
      });
      return;
    }

    try {
      const response = await fetch(`${APP_URL}products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setErrors({});
        Swal.fire({
          title: 'Product Updated Successfully!',
          icon: 'success'
        }).then(() => {
          navigate('/products');
        });
      } else {
        const errorData = await response.json();
        Swal.fire({
          title: 'Error',
          text: errorData.message || 'Failed to update product',
          icon: 'error'
        });
      }
    } catch (error) {
      console.error('Error updating product:', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to update product',
        icon: 'error'
      });
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

  if (loading) {
    return (
      <div className="auth-container">
        <div className="auth-form">
          <h2>Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Edit Product</h2>
        <p>Update your product information.</p>
        
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
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="productTitle">
              Title <span className="required">*</span>
            </label>
            <input
              type="text"
              id="productTitle"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={getInputClass('title')}
              placeholder="Enter your product title"
            />
            {errors.title && <span className="error-message">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="productDescription">
              Description <span className="required">*</span>
            </label>
            <textarea
              id="productDescription"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={getInputClass('description')}
              placeholder="Enter your product description"
              rows="4"
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
            />
            {errors.available_quantity && <span className="error-message">{errors.available_quantity}</span>}   
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary btn-block">
              Update Product
            </button>
            <button 
              type="button" 
              className="btn btn-secondary btn-block"
              onClick={() => navigate('/products')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;