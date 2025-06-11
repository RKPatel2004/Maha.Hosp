import React, { useEffect, useState } from 'react';
import Navbar from '../header_footer/navbar';
import Footer from '../header_footer/footer';
import './contactus.css';

const ContactUs = () => {
  const [hospitals, setHospitals] = useState([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    fetch('http://localhost:5000/api/hospitals')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setHospitals(data);
        } else if (Array.isArray(data.hospitals)) {
          setHospitals(data.hospitals);
        } else if (Array.isArray(data.data)) {
          setHospitals(data.data);
        } else {
          setHospitals([]);
        }
      })
      .catch((err) => {
        console.error('Error fetching hospitals:', err);
        setHospitals([]);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear status message when user starts typing
    if (submitStatus.message) {
      setSubmitStatus({ type: '', message: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: '', message: '' });

    try {
      const response = await fetch('http://localhost:5000/MahavirHospital/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: result.message || 'Your message has been sent successfully!'
        });
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          phone: '',
          email: '',
          message: ''
        });
      } else {
        setSubmitStatus({
          type: 'error',
          message: result.message || 'Failed to send message. Please try again.'
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus({
        type: 'error',
        message: 'Network error. Please check your connection and try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getEmbedMapSrc = (latitude, longitude) => {
    return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3720.2060574838606!2d${longitude}!3d${latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04e705192d03f%3A0xe4fc1330863e2f25!2sMahavir%20Hospital!5e0!3m2!1sen!2sin!4v1747814015434!5m2!1sen!2sin`;
  };

  return (
    <>
      <div className="contactus-hero">
        <div className="navbar-wrapper">
          <Navbar />
        </div>
        <h1>Contact Us</h1>
        <div className="breadcrumb">
          <a href="/">Home</a> / Contact Us
        </div>
      </div>

      <div className="contactus-section">
        <div className="contactus-heading">
          <span className="contactus-callaway">JUST A CALL AWAY</span>
          <h2>
            <span className="contactus-bold">We'd Love To</span> Hear From You!
          </h2>
          <p>
            We are here and always ready to help you. Let us know how we serve you and we'll get back within no time.
          </p>
        </div>

        {/* Status Message */}
        {submitStatus.message && (
          <div className={`status-message ${submitStatus.type}`}>
            {submitStatus.message}
          </div>
        )}

        <form className="contactus-form" onSubmit={handleSubmit}>
          <div className="contactus-row">
            <input 
              type="text" 
              name="firstName"
              placeholder="Your Name" 
              className="contactus-input" 
              value={formData.firstName}
              onChange={handleInputChange}
              required 
              disabled={isSubmitting}
            />
            <input 
              type="text" 
              name="lastName"
              placeholder="Last Name" 
              className="contactus-input" 
              value={formData.lastName}
              onChange={handleInputChange}
              required 
              disabled={isSubmitting}
            />
          </div>
          <div className="contactus-row">
            <input 
              type="tel" 
              name="phone"
              placeholder="Phone Number" 
              className="contactus-input" 
              value={formData.phone}
              onChange={handleInputChange}
              required 
              disabled={isSubmitting}
            />
            <input 
              type="email" 
              name="email"
              placeholder="Your Email" 
              className="contactus-input" 
              value={formData.email}
              onChange={handleInputChange}
              required 
              disabled={isSubmitting}
            />
          </div>
          <textarea 
            name="message"
            placeholder="Your Message" 
            className="contactus-textarea" 
            value={formData.message}
            onChange={handleInputChange}
            required 
            disabled={isSubmitting}
          />
          <button 
            type="submit" 
            className="contactus-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>

      {/* Hospital Maps Section */}
      <div className="hospital-maps-wrapper">
        <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>Our Hospital Locations</h2>
        {Array.isArray(hospitals) && hospitals.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#888' }}>Loading hospital locations...</div>
        ) : (
          <div className="hospital-maps-grid">
            {hospitals.map((hospital, idx) => (
              <div key={hospital._id || idx} className="hospital-map-card">
                <h3 className="hospital-map-title">{hospital.HospitalName}</h3>
                <div className="hospital-map-iframe-wrapper">
                  <iframe
                    src={getEmbedMapSrc(hospital.latitude, hospital.longitude)}
                    width="100%"
                    height="350"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={hospital.name}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default ContactUs;