import React, { useState } from 'react';
import Swal from 'sweetalert2';
import '../../style/RegisterLogin.css';
const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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

  const validateLoginForm = () => {
    const newErrors = {};

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
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    return newErrors;
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    const validationErrors = validateLoginForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      Swal.fire({
        title: 'Validation Error',
        text: 'Please fix the errors in the form before submitting.',
        icon: 'error'
      });
      return;
    }

    setErrors({});
    Swal.fire({
      title: 'Login Successful!',
      text: `Welcome back! ${formData.rememberMe ? 'You will stay logged in.' : ''}`,
      icon: 'success'
    });
    
    // Reset form
    setFormData({
      email: '',
      password: '',
      rememberMe: false
    });
    setIsSubmitted(false);
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
        <h2>Welcome Back</h2>
        <p>Please sign in to your account.</p>
        
        <form onSubmit={handleLoginSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="loginEmail">
              Email Address <span className="required">*</span>
            </label>
            <input
              type="email"
              id="loginEmail"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={getInputClass('email')}
              placeholder="Enter your email address"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="loginPassword">
              Password <span className="required">*</span>
            </label>
            <div className="password-input-container">
              <input
                type={showPassword ? 'text' : 'password'}
                id="loginPassword"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={getInputClass('password')}
                placeholder="Enter your password"
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
          </div>

          <div className="form-options">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="checkbox-input"
              />
              <span className="checkmark"></span>
              Remember me
            </label>
            <a href="#" className="link forgot-password">Forgot Password?</a>
          </div>

          <button type="submit" className="btn btn-primary btn-block">
            Sign In
          </button>
        </form>

        <div className="auth-footer">
          <p>Don't have an account? <a href="#" className="link">Create one here</a></p>
        </div>
      </div>
    </div>
  );
};
export default Login;