import { useState } from 'react';
import Swal from 'sweetalert2';
import '../../style/Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  // State to store validation errors
  const [errors, setErrors] = useState({});
  
  // State to track if form has been submitted (for styling)
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value
    });

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters long';
    } else if (formData.name.trim().length > 50) {
      newErrors.name = 'Name must be less than 50 characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long';
    } else if (formData.message.trim().length > 500) {
      newErrors.message = 'Message must be less than 500 characters';
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    // Validate form
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      // If there are errors, set them and show error message
      setErrors(validationErrors);
      Swal.fire({
        title: 'Validation Error',
        text: 'Please fix the errors in the form before submitting.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }

    // If no errors, proceed with form submission
    setErrors({});
    Swal.fire({
      title: 'Success!',
      text: 'Thank you for your message! We will get back to you soon.',
      icon: 'success',
      confirmButtonText: 'OK'
    });
    
    // Reset form
    setFormData({ name: '', email: '', message: '' });
    setIsSubmitted(false);
  };

  // Helper function to get input class based on validation state
  const getInputClass = (fieldName) => {
    let baseClass = 'form-input';
    
    if (isSubmitted) {
      if (errors[fieldName]) {
        baseClass += ' error';
      } else if (formData[fieldName].trim()) {
        baseClass += ' success';
      }
    }
    
    return baseClass;
  };

  return (
    <div className="page">
      <h1>Contact Us</h1>
      <p>We'd love to hear from you! Send us a message.</p>
      
      <form onSubmit={handleSubmit} className="contact-form" noValidate>
        <div className="form-group">
          <label htmlFor="name">
            Name: <span className="required">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={getInputClass('name')}
            placeholder="Enter your full name"
            required
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="email">
            Email: <span className="required">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={getInputClass('email')}
            placeholder="Enter your email address"
            required
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="message">
            Message: <span className="required">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            className={getInputClass('message')}
            placeholder="Enter your message (minimum 10 characters)"
            rows="5"
            required
          ></textarea>
          {errors.message && <span className="error-message">{errors.message}</span>}
          <div className="character-count">
            {formData.message.length}/500 characters
          </div>
        </div>
        
        <button type="submit" className="btn btn-primary">
          Send Message
        </button>
      </form>
    </div>
  );
};

export default Contact;