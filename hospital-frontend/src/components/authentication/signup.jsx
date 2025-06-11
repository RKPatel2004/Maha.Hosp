import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../header_footer/navbar';
import Footer from '../header_footer/footer';
import './signup.css';

const Signup = () => {
  const [step, setStep] = useState(1); // 1: mobile, 2: OTP, 3: details
  const [mobileNo, setMobileNo] = useState('');
  const [mobileError, setMobileError] = useState('');
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [backendOtp, setBackendOtp] = useState(''); // OTP from backend response
  const [userName, setUserName] = useState('');
  const [userNameError, setUserNameError] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);
  const [storedMobileNo, setStoredMobileNo] = useState(''); // Store mobileNo from backend response
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();

  // Helper to always return mobile number with '91' prefix
  const getPrefixedMobileNo = () => {
    let mn = mobileNo.replace(/\D/g, '').slice(-10);
    return mn.length === 10 ? '91' + mn : mn;
  };

  // Step 1: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setMobileError('');
    setSubmitError('');
    // Validate mobile number
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileNo) {
      setMobileError('Mobile number is required');
      return;
    }
    if (!mobileRegex.test(mobileNo)) {
      setMobileError('Please enter a valid Indian mobile number');
      return;
    }
    setLoading(true);
    try {
      // Always send 91-prefixed mobile number
      const prefixedMobileNo = getPrefixedMobileNo();
      const res = await axios.post('http://localhost:5000/MahavirHospital/api/signup/send-otp', {
        mobileNo: prefixedMobileNo
      });
      // Store OTP and MobileNo from backend response
      setBackendOtp(res.data.OTP);
      setStoredMobileNo(res.data.MobileNo ? res.data.MobileNo.slice(-10) : mobileNo);
      setStep(2);
    } catch (err) {
      // Check for already registered number
      const msg = err?.response?.data?.message;
      if (
        msg &&
        (msg.toLowerCase().includes('already registered') ||
          msg.toLowerCase().includes('already exists'))
      ) {
        setMobileError('Mobile number already registered.');
      } else {
        setSubmitError(msg || 'Failed to send OTP');
      }
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setOtpError('');
    setSubmitError('');
    if (!otp) {
      setOtpError('OTP is required');
      return;
    }
    setLoading(true);
    try {
      // Use storedMobileNo with 91 prefix for verification
      const prefixedMobileNo = '91' + storedMobileNo;
      await axios.post('http://localhost:5000/MahavirHospital/api/signup/verify-otp', {
        mobileNo: prefixedMobileNo,
        otp
      });
      setStep(3);
    } catch (err) {
      setSubmitError(
        err?.response?.data?.message || 'Failed to verify OTP'
      );
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Register user
  const handleRegister = async (e) => {
    e.preventDefault();
    setUserNameError('');
    setPasswordError('');
    setSubmitError('');
    setSuccessMessage('');

    if (!userName) {
      setUserNameError('Name is required');
      return;
    }
    if (!password) {
      setPasswordError('Password is required');
      return;
    }
    if (!confirmPassword) {
      setPasswordError('Please confirm your password');
      return;
    }
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/MahavirHospital/api/signup/final-signup', {
        UserName: userName,
        MobileNo: storedMobileNo,
        UserPassword: password,
        ConfirmPassword: confirmPassword
      });
      setSuccessMessage('Registered Successfully');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      setSubmitError(
        err?.response?.data?.message || 'Failed to register'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className='navbar-wrapper'>
        <Navbar />
      </div>
      <div className="signup-content-wrapper">
        <div className="signup-container">
          {step === 1 && (
            <form className="signup-form" onSubmit={handleSendOtp}>
              <h2 className="signup-title">Sign Up Here</h2>
              <label className="signup-label">
                Mobile No. <span className="required">*</span>
              </label>
              <div className="mobile-input-wrapper">
                <div className="country-code">91</div>
                <input
                  type="tel"
                  className="mobile-input"
                  placeholder="Mobile Number"
                  value={mobileNo}
                  onChange={e => setMobileNo(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  maxLength={10}
                  required
                />
              </div>
              {mobileError && <span className="error-message">{mobileError}</span>}
              <button className="register-btn" type="submit" disabled={loading}>
                {loading ? 'Sending OTP...' : 'Register | +'}
              </button>
              {submitError && <div className="error-message">{submitError}</div>}
              <div className="signin-link">
                Already Have An Account? <a href="/login">Sign In</a>
              </div>
            </form>
          )}

          {step === 2 && (
            <form className="otp-form" onSubmit={handleVerifyOtp}>
              <h2 className="signup-title">Verify OTP</h2>
              <div className="otp-backend">
                <span>Your OTP: </span>
                <span className="otp-value">{backendOtp}</span>
                <span className="otp-hint">(Enter this OTP below)</span>
              </div>
              <input
                type="text"
                className="otp-input"
                placeholder="Enter OTP"
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
                required
              />
              {otpError && <span className="error-message">{otpError}</span>}
              <button className="register-btn" type="submit" disabled={loading}>
                {loading ? 'Verifying...' : 'Next'}
              </button>
              {submitError && <div className="error-message">{submitError}</div>}
            </form>
          )}

          {step === 3 && (
            <form className="details-form" onSubmit={handleRegister}>
              <h2 className="signup-title">User Details</h2>
              <input
                type="text"
                className="details-input"
                placeholder="Enter Name"
                value={userName}
                onChange={e => setUserName(e.target.value)}
                required
              />
              {userNameError && <span className="error-message">{userNameError}</span>}
              <div className="mobile-input-wrapper">
                <div className="country-code">91</div>
                <input
                  type="tel"
                  className="mobile-input"
                  value={storedMobileNo}
                  disabled
                  readOnly
                />
              </div>
              <input
                type="password"
                className="details-input"
                placeholder="Enter Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <input
                type="password"
                className="details-input"
                placeholder="Enter Confirm Password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
              />
              {passwordError && <span className="error-message">{passwordError}</span>}
              <button className="register-btn" type="submit" disabled={loading || !!successMessage}>
                {loading ? 'Submitting...' : 'Submit'}
              </button>
              {successMessage && (
                <div className="success-message">{successMessage}</div>
              )}
              {submitError && <div className="error-message">{submitError}</div>}
            </form>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Signup;
