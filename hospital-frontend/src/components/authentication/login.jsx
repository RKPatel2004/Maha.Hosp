import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './login.css';
import Navbar from '../header_footer/navbar';
import Footer from '../header_footer/footer';

const Login = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [backendError, setBackendError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Validation functions
  const validateMobileNumber = (mobile) => {
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobile) {
      return 'Mobile number is required';
    }
    if (mobile.length !== 10) {
      return 'Mobile number must be exactly 10 digits';
    }
    if (!mobileRegex.test(mobile)) {
      return 'Please enter a valid Indian mobile number';
    }
    return '';
  };

  // Password validation: only check for required and max length
  const validatePassword = (pwd) => {
    if (!pwd) {
      return 'Password is required';
    }
    if (pwd.length > 50) {
      return 'Password must be less than 50 characters';
    }
    return '';
  };

  // Handle input changes with validation
  const handleMobileChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
    if (value.length <= 10) {
      setMobileNumber(value);
      if (touched.mobileNumber) {
        setErrors(prev => ({
          ...prev,
          mobileNumber: validateMobileNumber(value)
        }));
      }
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    if (touched.password) {
      setErrors(prev => ({
        ...prev,
        password: validatePassword(value)
      }));
    }
  };

  // Handle field blur events
  const handleBlur = (fieldName) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));

    if (fieldName === 'mobileNumber') {
      setErrors(prev => ({
        ...prev,
        mobileNumber: validateMobileNumber(mobileNumber)
      }));
    }

    if (fieldName === 'password') {
      setErrors(prev => ({
        ...prev,
        password: validatePassword(password)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({ mobileNumber: true, password: true });

    // Validate all fields
    const mobileError = validateMobileNumber(mobileNumber);
    const passwordError = validatePassword(password);

    const newErrors = {
      mobileNumber: mobileError,
      password: passwordError
    };

    setErrors(newErrors);

    // Check if there are any errors
    if (!mobileError && !passwordError) {
      setIsSubmitting(true);
      setBackendError('');
      try {
        // Special case for admin login
        if (mobileNumber === '9904563000' && password === '123') {
          const response = await axios.post(
            'http://localhost:5000/MahavirHospital/api/admin-login',
            {
              MobileNo: mobileNumber,
              Password: password
            },
            {
              headers: {
                'Content-Type': 'application/json'
              }
            }
          );
          sessionStorage.setItem('authToken', response.data.token);
          navigate('/admin-user-master/dashboard');
        } else {
          // Normal user login
          const response = await axios.post(
            'http://localhost:5000/MahavirHospital/api/login',
            {
              MobileNo: mobileNumber,
              UserPassword: password
            },
            {
              headers: {
                'Content-Type': 'application/json'
              }
            }
          );
          sessionStorage.setItem('authToken', response.data.token);
          navigate('/admin/edit-profile');
        }
      } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
          setBackendError(error.response.data.message);
        } else {
          setBackendError('An error occurred during login');
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleForgotPassword = () => {
    // Handle forgot password logic
    console.log('Forgot password clicked');
    navigate('/forgot-password');
  };

  const handleSignUp = () => {
    // Handle sign up navigation
    console.log('Sign up clicked');
    navigate('/signup');
  };

  return (
    <div className="login-page">
      <div className='navbar-wrapper'>
        <Navbar />
      </div>
      <div className="login-container">
        <div className="login-form-wrapper">
          <h1 className="login-title">Sign In</h1>

          <form onSubmit={handleSubmit} className="login-form">
            {/* Mobile Input */}
            <div className="input-group">
              <div className={`mobile-input-wrapper ${errors.mobileNumber && touched.mobileNumber ? 'error' : ''}`}>
                <div className="country-code">91</div>
                <input
                  type="tel"
                  placeholder="Mobile Number"
                  value={mobileNumber}
                  onChange={handleMobileChange}
                  onBlur={() => handleBlur('mobileNumber')}
                  className="mobile-input"
                  maxLength="10"
                  required
                />
              </div>
              {errors.mobileNumber && touched.mobileNumber && (
                <span className="error-message">{errors.mobileNumber}</span>
              )}
            </div>

            {/* Password Input */}
            <div className="input-group">
              <label className="password-label">
                Password <span className="required">*</span>
              </label>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
                onBlur={() => handleBlur('password')}
                className={`password-input ${errors.password && touched.password ? 'error' : ''}`}
                required
              />
              {errors.password && touched.password && (
                <span className="error-message">{errors.password}</span>
              )}
            </div>

            {/* Backend Error Message */}
            {backendError && (
              <div className="input-group">
                <span className="error-message">{backendError}</span>
              </div>
            )}

            <div className="forgot-password-wrapper">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="forgot-password-link"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              className="login-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="signup-section">
            <span className="signup-text">Don't Have An Account Yet? </span>
            <button
              type="button"
              onClick={handleSignUp}
              className="signup-link"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Login;
