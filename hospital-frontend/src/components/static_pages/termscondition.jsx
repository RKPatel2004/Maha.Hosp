import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../header_footer/navbar';
import Footer from '../header_footer/footer';
import './termscondition.css';

const TermsCondition = () => {
  const [termsContent, setTermsContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchTermsCondition = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/terms-condition');
        if (
          response.data &&
          response.data.success &&
          response.data.data &&
          Array.isArray(response.data.data) &&
          response.data.data.length > 0
        ) {
          const termsData = response.data.data[0];
          if (termsData.TermsConditionMessage) {
            setTermsContent(termsData.TermsConditionMessage);
          } else {
            setTermsContent('<p>Terms & Conditions content not available at this time.</p>');
          }
        } else {
          setTermsContent('<p>Terms & Conditions content not available at this time.</p>');
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to load Terms & Conditions content. Please try again later.');
        setLoading(false);
      }
    };

    fetchTermsCondition();
  }, []);

  return (
    <div className="terms-condition-page">
      <div className="navbar-wrapper">
        <Navbar />
      </div>

      <div className="terms-banner">
        <h1>Terms & Conditions</h1>
        <div className="breadcrumb">
          <a href="/">Home</a> <span> / Terms & Conditions </span>
        </div>
      </div>

      <div className="terms-content container">
        {loading ? (
          <div className="loading">Loading terms & conditions...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <div dangerouslySetInnerHTML={{ __html: termsContent }} />
        )}
      </div>

      <Footer />
    </div>
  );
};

export default TermsCondition;
