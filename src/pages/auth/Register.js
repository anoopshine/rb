import React, { useState } from 'react';
import Swal from 'sweetalert2';
import '../../style/RegisterLogin.css';
import axios from 'axios';

// API configuration
const API_BASE_URL = 'http://192.168.10.7:8080/api/';

// Configure axios defaults
axios.defaults.baseURL = API_BASE_URL;
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.headers.common['Content-Type'] = 'application/json';
// Register Component
const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  const validateRegisterForm = () => {
    const newErrors = {};

    // First Name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }

    // Last Name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
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

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else {
      if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters long';
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
        newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
      }
    }

    // Confirm Password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Terms agreement validation
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    return newErrors;
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    const validationErrors = validateRegisterForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      Swal.fire({
        title: 'Validation Error',
        text: 'Please fix the errors in the form before submitting.',
        icon: 'error'
      });
      return;
    }

    // setErrors({});
 try {
      // Clear previous errors
      setErrors({});

      // Prepare data for API (combine first and last name)
      const apiData = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.confirmPassword
      };

      // Make API call to Laravel backend
       const response = await axios.post('register', apiData);
      if (response.data.success) {
        // Store token in localStorage
        const { access_token, user } = response.data.data;
        localStorage.setItem('auth_token', access_token);
        localStorage.setItem('user_data', JSON.stringify(user));

        // Set authorization header for future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

        // Success message
        Swal.fire({
          title: 'Registration Successful!',
          text: `Welcome ${user.name}! Your account has been created successfully.`,
          icon: 'success',
          confirmButtonText: 'Continue'
        }).then(() => {
          // Redirect to dashboard or login page
          // window.location.href = '/home'; // or use React Router navigate
        });

        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirmPassword: '',
          agreeToTerms: false
        });
        setIsSubmitted(false);
      }

    } catch (error) {
      console.error('Registration error:', error);
      
      if (error.response) {
        // Server responded with error status
        const { status, data } = error.response;
        
        if (status === 422) {
          // Validation errors from server
          if (data.errors) {
            const serverErrors = {};
            Object.keys(data.errors).forEach(key => {
              // Map server field names to form field names
              if (key === 'name') {
                serverErrors.firstName = data.errors[key][0];
              } else if (key === 'email') {
                serverErrors.email = data.errors[key][0];
              } else if (key === 'password') {
                serverErrors.password = data.errors[key][0];
              }
            });
            setErrors(serverErrors);
          }
          
          Swal.fire({
            title: 'Validation Error',
            text: data.message || 'Please check your input and try again.',
            icon: 'error'
          });
        } else if (status === 500) {
          Swal.fire({
            title: 'Server Error',
            text: 'Something went wrong on our end. Please try again later.',
            icon: 'error'
          });
        } else {
          Swal.fire({
            title: 'Registration Failed',
            text: data.message || 'An unexpected error occurred.',
            icon: 'error'
          });
        }
      } else if (error.request) {
        // Network error
        Swal.fire({
          title: 'Network Error',
          text: 'Unable to connect to the server. Please check your internet connection.',
          icon: 'error'
        });
      } else {
        // Other error
        Swal.fire({
          title: 'Error',
          text: 'An unexpected error occurred. Please try again.',
          icon: 'error'
        });
      }
    } finally {
      // setIsLoading(false);
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
        <h2>Create Account</h2>
        <p>Join us today! Please fill in the information below.</p>
        
        <form onSubmit={handleRegisterSubmit} noValidate>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">
                First Name <span className="required">*</span>
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={getInputClass('firstName')}
                placeholder="Enter your first name"
              />
              {errors.firstName && <span className="error-message">{errors.firstName}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="lastName">
                Last Name <span className="required">*</span>
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={getInputClass('lastName')}
                placeholder="Enter your last name"
              />
              {errors.lastName && <span className="error-message">{errors.lastName}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">
              Email Address <span className="required">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={getInputClass('email')}
              placeholder="Enter your email address"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">
              Password <span className="required">*</span>
            </label>
            <div className="password-input-container">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={getInputClass('password')}
                placeholder="Create a strong password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {errors.password && <span className="error-message">{errors.password}</span>}
            <div className="password-requirements">
              <small>Password must be at least 8 characters with uppercase, lowercase, and number</small>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">
              Confirm Password <span className="required">*</span>
            </label>
            <div className="password-input-container">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={getInputClass('confirmPassword')}
                placeholder="Confirm your password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                className="checkbox-input"
              />
              <span className="checkmark"></span>
              I agree to the <a href="#" className="link">Terms of Service</a> and <a href="#" className="link">Privacy Policy</a> <span className="required">*</span>
            </label>
            {errors.agreeToTerms && <span className="error-message">{errors.agreeToTerms}</span>}
          </div>

          <button type="submit" className="btn btn-primary btn-block">
            Create Account
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <a href="#" className="link">Sign in here</a></p>
        </div>
      </div>
    </div>
  );
};
export default Register;