import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './home.css';
import Navbar from '../header_footer/navbar';
import Footer from '../header_footer/footer';
import homeiframeVideo from '../../assets/home/iframe_video.png';
import misson from '../../assets/home/misson.png';
import vision from '../../assets/home/vision.png';
import { FaPlay, FaPlus } from 'react-icons/fa';
import doctorImage from '../../assets/home/lady_doctor.png'; 
import bulletinImage from '../../assets/home/bulletin.png';
import axios from 'axios';

const importAll = (r) => {
  let images = {};
  r.keys().forEach((item) => {
    const imageName = item.replace('./', '');
    images[imageName] = r(item);
  });
  return images;
};

const tpaAffiliationImages = importAll(require.context('../../assets/home/TPAAffiliation', false, /\.(png|jpe?g|svg)$/));

const Home = () => {

  const navigate = useNavigate();

  const [activeSlide, setActiveSlide] = useState(0);
  const [activeAffiliationSlide, setActiveAffiliationSlide] = useState(0);
  const [missionVisionData, setMissionVisionData] = useState({
    Misson: "Loading mission...",
    Vision: "Loading vision..."
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bulletins, setBulletins] = useState([]);
  const [bulletinLoading, setBulletinLoading] = useState(true);
  const [bulletinError, setBulletinError] = useState(null);
  const [affiliationData, setAffiliationData] = useState([]);
  const [affiliationLoading, setAffiliationLoading] = useState(true);
  const [affiliationError, setAffiliationError] = useState(null);
  // Add states to track which plus icons are rotated
  const [readMoreIconRotated, setReadMoreIconRotated] = useState(false);
  const [signInIconRotated, setSignInIconRotated] = useState(false);
  const [bulletinIconsRotated, setBulletinIconsRotated] = useState({});
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const organDonationData = [
    { number: "60", type: "Kidney" },
    { number: "26", type: "Liver" },
    { number: "5", type: "Heart" },
    { number: "44", type: "Eyes" },
    { number: "1", type: "Lung" },
    { number: "1", type: "Pancreatic" }
  ];

  // Fetch mission and vision data
  useEffect(() => {
    const fetchMissionVision = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/MahavirHospital/api/misson-vision');
        
        if (response.data.success && response.data.data.length > 0) {
          setMissionVisionData(response.data.data[0]);
        } else {
          setError('No mission and vision data found');
        }
      } catch (err) {
        console.error('Error fetching mission and vision data:', err);
        setError('Failed to load mission and vision data');
      } finally {
        setLoading(false);
      }
    };

    fetchMissionVision();
  }, []);

  // Fetch TPA affiliation data from database
  useEffect(() => {
    const fetchTPAAffiliations = async () => {
      try {
        setAffiliationLoading(true);
        const response = await axios.get('http://localhost:5000/MahavirHospital/api/TPAAffiliation');
        
        if (response.data.success && response.data.data) {
          // Format the data for display
          const affiliations = response.data.data.map(affiliation => ({
            companyName: affiliation.CompanyName,
            logo: affiliation.Logo,
            id: affiliation._id
          }));
          
          // Organize affiliations into groups of 6 for the carousel
          const imagesPerSlide = 6;
          const groupedAffiliations = [];
          
          for (let i = 0; i < affiliations.length; i += imagesPerSlide) {
            const group = affiliations.slice(i, i + imagesPerSlide);
            
            // If the last group has fewer than 6 images, pad with empty objects
            if (group.length < imagesPerSlide) {
              const emptyCount = imagesPerSlide - group.length;
              for (let j = 0; j < emptyCount; j++) {
                group.push({ companyName: "", logo: "", id: `empty-${j}` });
              }
            }
            
            groupedAffiliations.push(group);
          }
          
          setAffiliationData(groupedAffiliations);
        } else {
          setAffiliationError('No TPA affiliation data found');
        }
      } catch (err) {
        console.error('Error fetching TPA affiliation data:', err);
        setAffiliationError('Failed to load TPA affiliation data');
      } finally {
        setAffiliationLoading(false);
      }
    };

    fetchTPAAffiliations();
  }, []);

  // Fetch bulletins data
  useEffect(() => {
    const fetchBulletins = async () => {
      try {
        setBulletinLoading(true);
        const response = await axios.get('http://localhost:5000/MahavirHospital/api/random-bulletins');
        
        if (response.data.success && response.data.data) {
          setBulletins(response.data.data);
        } else {
          setBulletinError('No bulletin data found');
        }
      } catch (err) {
        console.error('Error fetching bulletin data:', err);
        setBulletinError('Failed to load bulletin data');
      } finally {
        setBulletinLoading(false);
      }
    };

    fetchBulletins();
  }, []);

  // Auto-rotate organ donation slides
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide(prevSlide => (prevSlide + 1) % organDonationData.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [organDonationData.length]);

  // Auto-rotate affiliation slides every 3 seconds
  useEffect(() => {
    if (affiliationData.length > 0) {
      const interval = setInterval(() => {
        setActiveAffiliationSlide(prevSlide => (prevSlide + 1) % affiliationData.length);
      }, 3000);
      
      return () => clearInterval(interval);
    }
  }, [affiliationData.length]);

  // Helper function to get the correct image source for an affiliation
  const getAffiliationImageSrc = (logoName) => {
    if (!logoName) return null;
    
    // Check if the image exists in our imported images
    if (tpaAffiliationImages[logoName]) {
      return tpaAffiliationImages[logoName];
    }
    
    // Fallback to a more flexible approach if the exact match isn't found
    const imageKey = Object.keys(tpaAffiliationImages).find(key => 
      key.toLowerCase() === logoName.toLowerCase() ||
      key.toLowerCase().includes(logoName.toLowerCase())
    );
    
    return imageKey ? tpaAffiliationImages[imageKey] : null;
  };

  // Handle click on the Read More button
  const handleReadMoreClick = () => {
    setReadMoreIconRotated(!readMoreIconRotated);
    navigate('/health-plans');
  };

  // Handle click on the Sign In button
  const handleSignInClick = () => {
    setSignInIconRotated(!signInIconRotated);
    // Add your sign in logic here
    navigate('/login');
  };

  // Handle click on a bulletin's Read More link
  const handleBulletinReadMoreClick = (bulletinId) => {
    setBulletinIconsRotated(prev => ({ 
      ...prev, 
      [bulletinId]: !prev[bulletinId] 
    }));
    // Navigate to the bulletin detail page
    navigate(`/bulletin`);
  };

  return (
    <div className="home-container">
      {/* Navbar Component */}
      <div className="navbar-wrapper">
        <Navbar />
      </div>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-left">
            <p className="welcome-text">WELCOME TO MAHAVIRHOSPITALS</p>
            <h1 className="hero-title">
              <span className="title-emphasis">YOUR HEALTH</span> OUR FIRST PRIORITY
            </h1>
            <button className="read-more-btn" onClick={handleReadMoreClick}>
              Read More <FaPlus className={`plus-icon ${readMoreIconRotated ? 'rotated' : ''}`} />
            </button>
          </div>
          <div className="hero-right">
            <div className="opd-card">
              <div className="video-container">
                <img 
                  src={homeiframeVideo} 
                  alt="Hospital Video" 
                  className="video-thumbnail" 
                  onClick={() => window.open('https://www.youtube.com/watch?v=kcrQPWerxX4', '_blank')}
                />
                <div className="play-button">
                  <FaPlay />
                </div>
              </div>
              
              <div className="opd-info">
                <h2 className="opd-title">OPD Time</h2>
                <div className="opd-schedule">
                  <div className="schedule-row">
                    <span className="schedule-day">Monday - Friday</span>
                    <span className="schedule-time">6:00 - 7:00 AM</span>
                  </div>
                  <div className="schedule-row">
                    <span className="schedule-day">Saturday</span>
                    <span className="schedule-time">7:00 - 8:00 AM</span>
                  </div>
                  <div className="schedule-row">
                    <span className="schedule-day">Sunday</span>
                    <span className="schedule-time closed">Closed</span>
                  </div>
                </div>
                <button className="sign-in-btn" onClick={handleSignInClick}>
                  Sign In / Up <FaPlus className={`plus-icon ${signInIconRotated ? 'rotated' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Shree Mahavir Hospitals Section */}
      <section className="why-mahavir-section">
        <div className="why-mahavir-container">
          <div className="section-top-label">ABOUT US</div>
          <h2 className="section-title">Why Shree Mahavir Hospitals</h2>
          <p className="section-description">
            Shree Mahavir Health and Medical relief Society, a public charitable trust is pioneer in providing high quality healthcare service since 1978 in
            South Gujarat. The mission of the trust and the hospital is to provide high quality treatment at competitive pricing and liberal charity. We are
            the oldest, time tested and biggest Healthcare Institutions in South Gujarat. Mahavir hospital has best infrastructure, equipments, specialists
            and trained staff in South Gujarat. The vision of the trust is far reaching with well intentioned management.
          </p>
          
          <div className="mission-vision-container">
            {loading ? (
              <div className="loading-message">Loading mission and vision data...</div>
            ) : error ? (
              <div className="error-message">{error}</div>
            ) : (
              <>
                <div className="mission-vision-card">
                  <div className="mission-vision-icon">
                    <img src={misson} alt="Mission" />
                  </div>
                  <h3 className="mission-vision-title">Mission</h3>
                  <p className="mission-vision-text">
                    {missionVisionData.Misson || "Mission statement not available"}
                  </p>
                </div>
                
                <div className="mission-vision-card">
                  <div className="mission-vision-icon">
                    <img src={vision} alt="Vision" />
                  </div>
                  <h3 className="mission-vision-title">Vision</h3>
                  <p className="mission-vision-text">
                    {missionVisionData.Vision || "Vision statement not available"}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Trusted Hospital Section */}
      <section className="trusted-hospital-section">
        <div className="trusted-hospital-content">
          <div className="trusted-hospital-left">
            <div className="trusted-hospital-info">
              <div className="about-text">ABOUT MAHAVIRHOSPITALS</div>
              <h2 className="trusted-hospital-title">Trusted Hospital</h2>
              <p className="trusted-hospital-description">
                Providing high quality healthcare service since 1978 in South Gujarat.
              </p>
            </div>
            
            <div className="hospital-info-container">
              <div className="working-hours-card">
                <h3 className="working-hours-title">Working Hours</h3>
                <div className="hours-schedule">
                  <div className="hours-item">
                    <h4>Monday to Saturday</h4>
                    <p>6:00 - 7:00 pm</p>
                  </div>
                  <div className="hours-item">
                    <h4>Sunday</h4>
                    <p>6:00 - 5:00 pm</p>
                  </div>
                </div>
                <div className="emergency-hours">
                  <h4>Emergency 24 Hours</h4>
                </div>
              </div>
              
              <div className="chairperson-services-container">
                <div className="chairperson-info">
                  <h3>Smt. Rupaben Mehta</h3>
                  <p>Chair Person</p>
                </div>
                
                <div className="hospital-services">
                  <div className="service-item">
                    <span className="service-icon">✓</span>
                    <span className="service-text">Treats Minor Illnesses</span>
                  </div>
                  <div className="service-item">
                    <span className="service-icon">✓</span>
                    <span className="service-text">Answers Health Questions</span>
                  </div>
                  <div className="service-item">
                    <span className="service-icon">✓</span>
                    <span className="service-text">Conducts Health Checkups</span>
                  </div>
                  <div className="service-item">
                    <span className="service-icon">✓</span>
                    <span className="service-text">Performs Routine Health Tests</span>
                  </div>
                  <div className="service-item">
                    <span className="service-icon">✓</span>
                    <span className="service-text">Orthopaedic Surgeon</span>
                  </div>
                  <div className="service-item">
                    <span className="service-icon">✓</span>
                    <span className="service-text">Endocrinologist</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="trusted-hospital-right">
            <div className="doctor-image-container">
              <img src={doctorImage} alt="Doctor" className="doctor-image" />
              <div className="organ-donation-carousel">
                {organDonationData.map((item, index) => (
                  <div 
                    key={index} 
                    className={`organ-donation-badge ${index === activeSlide ? 'active' : ''}`}
                  >
                    <div className="badge-content">
                      <p className="donation-title">TOTAL CADAVER ORGAN DONATION THROUGH MAHAVIR HOSPITAL</p>
                      <h2 className="donation-number">{item.number}</h2>
                      <p className="donation-type">{item.type}</p>
                      <div className="donation-dots">
                        {organDonationData.map((_, dotIndex) => (
                          <span 
                            key={dotIndex} 
                            className={`dot ${dotIndex === index ? 'active' : ''}`}
                            onClick={() => setActiveSlide(dotIndex)}
                          ></span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bulletin Board Section */}
      <section className="bulletin-section">
        <div className="bulletin-container">
          <div className="bulletin-header">
            <span className="bulletin-label">BULLETIN BOARD</span>
            <h2 className="bulletin-title">Be In Touch For Updates</h2>
          </div>
          
          <div className="bulletin-cards-container">
            {bulletinLoading ? (
              <div className="loading-message">Loading bulletins...</div>
            ) : bulletinError ? (
              <div className="error-message">{bulletinError}</div>
            ) : (
              bulletins.map((bulletin, index) => (
                <div key={index} className="bulletin-card">
                  <img src={bulletinImage} alt="Bulletin" className="bulletin-image" />
                  <div className="bulletin-content">
                    <div className="bulletin-category">{bulletin.category}</div>
                    <h3 className="bulletin-card-title">{bulletin.Title}</h3>
                    <p className="bulletin-description">{bulletin.Description}</p>
                    <a 
                      href="/bulletin" 
                      className="bulletin-read-more"
                      onClick={(e) => {
                        e.preventDefault();
                        handleBulletinReadMoreClick(bulletin._id || index);
                      }}
                    >
                      Read More <FaPlus className={`plus-icon ${bulletinIconsRotated[bulletin._id || index] ? 'rotated' : ''}`} />
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* TPA Affiliation Section */}
      <section className="tpa-affiliation-section">
        <div className="tpa-affiliation-container">
          <div className="affiliation-header">
            <span className="affiliation-label">TPA AFFILIATION</span>
            <h2 className="affiliation-title">Our Affiliations</h2>
          </div>
          
          <div className="affiliation-carousel">
            {affiliationLoading ? (
              <div className="loading-message">Loading affiliations...</div>
            ) : affiliationError ? (
              <div className="error-message">{affiliationError}</div>
            ) : affiliationData.length === 0 ? (
              <div className="error-message">No affiliation data found</div>
            ) : (
              affiliationData.map((affiliationSet, setIndex) => (
                <div 
                  key={setIndex} 
                  className={`affiliation-slide ${setIndex === activeAffiliationSlide ? 'active' : ''}`}
                >
                  <div className="affiliation-logos">
                    {affiliationSet.map((affiliation) => (
                      <div key={affiliation.id} className="affiliation-logo-item">
                        {affiliation.logo && (
                          // Use the helper function to get the correct image source
                          <img 
                            src={getAffiliationImageSrc(affiliation.logo)} 
                            alt={affiliation.companyName || "TPA Affiliation"} 
                            className="affiliation-logo"
                            onError={(e) => {
                              console.log(`Failed to load image: ${affiliation.logo}`);
                              e.target.onerror = null;
                              e.target.style.display = 'none';
                            }}
                          />
                        )}
                        {affiliation.companyName && (
                          <p className="affiliation-name">{affiliation.companyName}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
            
            <div className="affiliation-dots">
              {affiliationData.map((_, dotIndex) => (
                <span 
                  key={dotIndex} 
                  className={`affiliation-dot ${dotIndex === activeAffiliationSlide ? 'active' : ''}`}
                  onClick={() => setActiveAffiliationSlide(dotIndex)}
                ></span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer Component */}
      <Footer />
    </div>
  );
};

export default Home;