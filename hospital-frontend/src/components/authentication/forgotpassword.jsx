import React, { useState } from 'react';
import Navbar from '../header_footer/navbar';
import Footer from '../header_footer/footer';
import './forgotpassword.css';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Enter Mobile, 2: Enter OTP, 3: Reset Password
  const [mobileNo, setMobileNo] = useState('');
  const [otp, setOtp] = useState('');
  const [displayOtp, setDisplayOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [mobileError, setMobileError] = useState('');
  const [otpError, setOtpError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [success, setSuccess] = useState('');

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
      const response = await fetch('http://localhost:5000/MahavirHospital/api/forgot-password/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mobileNo }),
      });

      const data = await response.json();

      if (response.ok) {
        setDisplayOtp(data.OTP); // Display OTP from response
        setSuccess(data.message);
        setStep(2);
      } else {
        setSubmitError(data.message || 'Failed to send OTP');
      }
    } catch (err) {
      setSubmitError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
      const response = await fetch('http://localhost:5000/MahavirHospital/api/forgot-password/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mobileNo, otp }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message);
        setStep(3);
      } else {
        setSubmitError(data.message || 'Invalid OTP');
      }
    } catch (err) {
      setSubmitError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setSubmitError('');

    if (!newPassword) {
      setPasswordError('Password is required');
      return;
    }
    if (!confirmPassword) {
      setPasswordError('Please confirm your password');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/MahavirHospital/api/forgot-password/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          mobileNo, 
          newPassword, 
          confirmPassword 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message);
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else {
        setSubmitError(data.message || 'Failed to reset password');
      }
    } catch (err) {
      setSubmitError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <form className="forgot-password-form" onSubmit={handleSendOtp}>
      <h2 className="forgot-password-title">Forgot Password</h2>
      <label className="forgot-password-label">
        Mobile No. <span className="required">*</span>
      </label>
      <div className="mobile-input-wrapper">
        <div className="country-code">91</div>
        <input
          type="tel"
          className="mobile-input"
          placeholder="Mobile Number"
          value={mobileNo}
          onChange={(e) => setMobileNo(e.target.value.replace(/\D/g, '').slice(0, 10))}
          maxLength="10"
          required
        />
      </div>
      {mobileError && <span className="error-message">{mobileError}</span>}
      <button type="submit" className="forgot-password-btn" disabled={loading}>
        {loading ? 'Sending OTP...' : 'Send OTP'}
      </button>
      {submitError && <div className="error-message">{submitError}</div>}
      <div className="signin-link">
        <a href="/login">Back to Login</a>
      </div>
    </form>
  );

  const renderStep2 = () => (
    <form className="forgot-password-form" onSubmit={handleVerifyOtp}>
      <h2 className="forgot-password-title">Verify OTP</h2>
      {displayOtp && (
        <div className="otp-backend">
          <span>Your OTP: </span>
          <span className="otp-value">{displayOtp}</span>
          <span className="otp-hint">(Enter this OTP below)</span>
        </div>
      )}
      <input
        type="text"
        className="otp-input"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
        maxLength="6"
        required
      />
      {otpError && <span className="error-message">{otpError}</span>}
      <button type="submit" className="forgot-password-btn" disabled={loading}>
        {loading ? 'Verifying...' : 'Verify OTP'}
      </button>
      {submitError && <div className="error-message">{submitError}</div>}
      <div className="signin-link">
        <button 
          type="button" 
          className="btn-link" 
          onClick={() => setStep(1)}
        >
          Change Mobile Number
        </button>
      </div>
    </form>
  );

  const renderStep3 = () => (
    <form className="forgot-password-form" onSubmit={handleResetPassword}>
      <h2 className="forgot-password-title">Reset Password</h2>
      <input
        type="password"
        className="details-input"
        placeholder="Enter New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
      />
      <input
        type="password"
        className="details-input"
        placeholder="Confirm New Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />
      {passwordError && <span className="error-message">{passwordError}</span>}
      <button type="submit" className="forgot-password-btn" disabled={loading}>
        {loading ? 'Resetting...' : 'Reset Password'}
      </button>
      {success && <div className="success-message">{success}</div>}
      {submitError && <div className="error-message">{submitError}</div>}
    </form>
  );

  return (
    <div className="forgot-password-page">
      <div className='navbar-wrapper'>
        <Navbar />
      </div>
      
      <div className="forgot-password-content-wrapper">
        <div className="forgot-password-container">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ForgotPassword;