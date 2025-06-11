import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import './footer.css';
import MahavirLogo from '../../assets/Mahavir/Mahavir_short_logo.png';
import axios from 'axios';

const Footer = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/hospitals', {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (response.data && response.data.success && response.data.data) {
          setHospitals(response.data.data);
        } else {
          throw new Error("Invalid data structure received from API");
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching hospital data:", err);
        setError(err.message || "Failed to fetch data");
        setLoading(false);
      }
    };

    fetchHospitals();
  }, []);

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">
          <img 
            src={MahavirLogo} 
            onClick={() => window.location.href = "/"} 
            alt="Mahavir Hospitals Logo" 
            style={{ cursor: 'pointer' }}
          />
          <div className="logo-text">
            <p className="organization-name">Shree Mahavir Health & Medical Relief Society</p>
            <h2 className="hospital-name">MAHAVIR HOSPITALS</h2>
          </div>
        </div>
        
        <div className="hospitals-container">
          {loading ? (
            <p>Loading hospitals information...</p>
          ) : error ? (
            <p className="error-message">Error loading data: {error}</p>
          ) : (
            hospitals.map((hospital) => (
              <div key={hospital._id || hospital.id} className="hospital-info">
                <h3>{hospital.ShortName || hospital.name}</h3>
                <p className="full-name">{hospital.HospitalName || hospital.fullName}</p>
                <p className="address">{hospital.HospitalAddress || hospital.address}</p>
                <p className="contact">Contact No. - {hospital.Phone1 || hospital.contactNo}</p>
                <p className="emergency">Emergency No. - {hospital.Phone2 || hospital.emergencyNo}</p>
                {(hospital.OPDAppointmentNumber || hospital.opdAppointment) && (
                  <p className="opd">OPD Appointment - {hospital.OPDAppointmentNumber || hospital.opdAppointment}</p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="copyright">
          ©{new Date().getFullYear()} Mahavir Hospitals, All Rights Reserved.
        </div>
        <div className="footer-links">
          <Link to="/privacy-policy">Privacy Policy</Link> | 
          <Link to="/terms-condition">Terms & Conditions</Link> |
          <Link to="/visitor-policy">Visitor's Policy</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;