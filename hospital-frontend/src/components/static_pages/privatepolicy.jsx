import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../header_footer/navbar';
import Footer from '../header_footer/footer';
import './privatepolicy.css';

const PrivatePolicy = () => {
  const [policyContent, setPolicyContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchPrivacyPolicy = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/private-policy');
        if (
          response.data &&
          response.data.success &&
          response.data.data &&
          Array.isArray(response.data.data) &&
          response.data.data.length > 0
        ) {
          const policyData = response.data.data[0];
          if (policyData.PrivatePolicyMessage) {
            setPolicyContent(policyData.PrivatePolicyMessage);
          } else {
            setPolicyContent('<p>Privacy policy content not available at this time.</p>');
          }
        } else {
          setPolicyContent('<p>Privacy policy content not available at this time.</p>');
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to load privacy policy content. Please try again later.');
        setLoading(false);
      }
    };

    fetchPrivacyPolicy();
  }, []);

  return (
    <div className="privacy-policy-page">
      <div className="navbar-wrapper">
        <Navbar />
      </div>

      <div className="privacy-banner">
        <h1>Privacy Policy</h1>
        <div className="breadcrumb">
          <a href="/">Home</a> / Privacy Policy
        </div>
      </div>

      <div className="privacy-content container">
        {loading ? (
          <div className="loading">Loading privacy policy...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <div dangerouslySetInnerHTML={{ __html: policyContent }} />
        )}
      </div>

      <Footer />
    </div>
  );
};

export default PrivatePolicy;
