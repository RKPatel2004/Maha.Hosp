import React, { useState } from 'react';
import './navbar.css';
import Mahavir_Logo from '../../assets/Mahavir/Mahavir_logo.png';
import { FaPhone, FaMapMarkerAlt, FaFacebookF, FaInstagram, FaYoutube, FaPlus, FaBars, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  
  const handleLinkClick = () => setMenuOpen(false);

  return (
    <div className="navbar-container">
      {/* Top info bar */}
      <div className="info-bar">
        <div className="contact-info">
          <div className="phone-info">
            <FaPhone className="icon" />
            0261 - 2292022/23
          </div>
          <div className="location-info">
            <FaMapMarkerAlt className="icon" />
            Nanpura, Surat
          </div>
        </div>
        <div className="social-links">
          Follow us :
          <a href="https://www.facebook.com/mahavirhospitals/" className="social-icon" rel='noreferrer noopener' target="_blank">
            <FaFacebookF />
          </a>
          <a href="https://www.instagram.com/mahavir_hospitals/" className="social-icon" rel='noreferrer noopener' target="_blank">
            <FaInstagram />
          </a>
          <a href="https://www.youtube.com/watch?v=kcrQPWerxX4&feature=youtu.be" className="social-icon" rel='noreferrer noopener' target="_blank">
            <FaYoutube />
          </a>
        </div>
      </div>
      
      {/* Main navbar */}
      <div className="main-navbar">
        <div className="logo-container">
          <img 
            src={Mahavir_Logo} 
            onClick={() => window.location.href = '/'} 
            alt="Mahavir Hospitals Logo" 
            className="logo" 
          />
        </div>
        
        {/* Hamburger icon for mobile */}
        <button 
          className="menu-toggle" 
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
        
        {/* Nav links */}
        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/" className="nav-link" onClick={handleLinkClick}>HOME</Link>
          <Link to="/about-us" className="nav-link" onClick={handleLinkClick}>ABOUT US</Link>
          <Link to="/health-plans" className="nav-link" onClick={handleLinkClick}>HEALTH PLANS</Link>
          <Link to="/bulletin" className="nav-link" onClick={handleLinkClick}>BULLETIN</Link>
          <Link to="/tpa-affiliation" className="nav-link" onClick={handleLinkClick}>TPA AFFILIATION</Link>
          <Link to="/career" className="nav-link" onClick={handleLinkClick}>CAREER</Link>
          <Link to="/contact-us" className="nav-link" onClick={handleLinkClick}>CONTACT US</Link>
          
          {/* Show sign-in button inside menu on mobile */}
          <div className="sign-in-button mobile-only">
            <button className="sign-in">
              Sign In / Up
              <FaPlus className="plus-icon" />
            </button>
          </div>
        </div>
        
        {/* Desktop sign-in button */}
        <div className="sign-in-button desktop-only">
          <button className="sign-in" onClick={() => window.location.href = '/login'}>
            Sign In / Up
            <FaPlus className="plus-icon" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;