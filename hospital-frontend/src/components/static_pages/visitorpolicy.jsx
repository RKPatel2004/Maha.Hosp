import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../header_footer/navbar';
import Footer from '../header_footer/footer';
import './visitorpolicy.css';

const VisitorPolicy = () => {
  const [visitorContent, setVisitorContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchVisitorPolicy = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/visitor-policy');
        if (
          response.data &&
          response.data.success &&
          response.data.data &&
          Array.isArray(response.data.data) &&
          response.data.data.length > 0
        ) {
          const visitorData = response.data.data[0];
          if (visitorData.VisitorPolicyMessage) {
            setVisitorContent(visitorData.VisitorPolicyMessage);
          } else {
            setVisitorContent('<p>Visitor policy content not available at this time.</p>');
          }
        } else {
          setVisitorContent('<p>Visitor policy content not available at this time.</p>');
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to load visitor policy content. Please try again later.');
        setLoading(false);
      }
    };

    fetchVisitorPolicy();
  }, []);

  return (
    <div className="visitor-policy-page">
      <div className="navbar-wrapper">
        <Navbar />
      </div>

      <div className="visitor-banner">
        <h1>Visitor Policy</h1>
        <div className="breadcrumb">
          <a href="/">Home</a> <span> / Visitor Policy </span>
        </div>
      </div>

      <div className="visitor-content container">
        {loading ? (
          <div className="loading">Loading visitor policy...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <div dangerouslySetInnerHTML={{ __html: visitorContent }} />
        )}
      </div>

      <Footer />
    </div>
  );
};

export default VisitorPolicy;
