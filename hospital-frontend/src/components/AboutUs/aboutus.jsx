import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../header_footer/navbar';
import Footer from '../header_footer/footer';
import './aboutus.css';
import aboutus1 from "../../assets/AboutUs/AboutUs1.png";
import aboutus2 from "../../assets/AboutUs/AboutUs2.png";
import aboutus3 from "../../assets/AboutUs/AboutUs3.png";

const AboutUs = () => {
  const [historyData, setHistoryData] = useState({
    id: null,
    hospitalID: null,
    history: [],
    paragraphs: []
  });
  const [aboutCards, setAboutCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get('http://localhost:5000/MahavirHospital/api/hospital-history/1');
        console.log('API Response:', response.data);
        
        // Check if response has data and data.data property (from the JSON structure)
        const responseData = response.data.data || response.data;
        
        // Set about cards data directly from paragraphs array
        if (responseData && responseData.paragraphs && Array.isArray(responseData.paragraphs)) {
          setAboutCards(responseData.paragraphs);
        }
        
        // Parse the HTML string into paragraphs if necessary
        let paragraphs = [];
        if (responseData && responseData.history) {
          // Split by paragraph tags if they exist
          if (typeof responseData.history === 'string' && responseData.history.includes('<p>')) {
            // Extract paragraphs using regex
            const regex = /<p>(.*?)<\/p>/g;
            let match;
            while ((match = regex.exec(responseData.history)) !== null) {
              paragraphs.push(match[0]);
            }
            
            // If no paragraphs were extracted, use the entire content as one paragraph
            if (paragraphs.length === 0) {
              paragraphs = [responseData.history];
            }
          } else {
            // If there are no paragraph tags, treat the whole string as one paragraph
            paragraphs = [responseData.history];
          }
        }
        
        setHistoryData({
          ...responseData,
          paragraphs: paragraphs
        });
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch hospital history');
        setLoading(false);
        console.error('Error fetching hospital history:', err);
      }
    };

    fetchHistory();
  }, []);

  // Helper function to extract the full content from paragraph entries
  const getFullParagraphContent = (paragraph) => {
    // Get content from the first available paragraph field
    const content = paragraph.paragraph1 || paragraph.paragraph2 || paragraph.paragraph3 || '';
    
    // Handle HTML entities like &nbsp;
    return content.replace(/&nbsp;/g, ' ');
  };

  // Helper function to extract title from paragraph entries
  const extractTitle = (paragraph) => {
    const content = paragraph.paragraph1 || paragraph.paragraph2 || paragraph.paragraph3 || '';
    // Extract title based on the pattern "01. High Quality Healthcare..."
    const titleRegex = /^\d+\.\s+([^&]+)/;
    const titleResult = titleRegex.exec(content);
    return titleResult ? titleResult[1].trim() : "Feature";
  };

  // Helper function to extract content without the numbering/title part
  const extractContent = (paragraph) => {
    const content = paragraph.paragraph1 || paragraph.paragraph2 || paragraph.paragraph3 || '';
    // Remove the numbering part (e.g., "01. High Quality Healthcare")
    return content.replace(/^\d+\.\s+[^&]+&nbsp;/, '').replace(/&nbsp;/g, ' ');
  };

  return (
    <>
      <div className="about-us-container">
        <div className="navbar-wrapper">
          <Navbar />
        </div>
        <div className="about-us-banner">
          <h1>About Us</h1>
          <div className="breadcrumb">
            <a href="/">Home</a> / Why Mahavir?
          </div>
        </div>

        <div className="about-us-content">
          {loading ? (
            <div className="loading">Loading data...</div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : (
            <>
              <div className="about-us-cards">
                {aboutCards && aboutCards.length > 0 ? (
                  aboutCards.map((card, index) => {
                    // Get the title and content
                    const title = extractTitle(card);
                    const content = extractContent(card);
                    
                    // Get proper icon based on index
                    const iconSrc = index === 0 ? aboutus1 : index === 1 ? aboutus2 : aboutus3;

                    return (
                      <div className="about-card" key={index}>
                        <div className="icon-container">
                          <img 
                            src={iconSrc} 
                            alt={`${title} Icon`} 
                            className="about-icon" 
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 7h-3a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Z'/%3E%3Cpath d='M14 14H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h3'/%3E%3Cline x1='9' x2='9' y1='4' y2='12'/%3E%3Cline x1='14' x2='14' y1='8' y2='12'/%3E%3C/svg%3E`;
                            }}
                          />
                        </div>
                        <h2>{title}</h2>
                        <p>{content}</p>
                      </div>
                    );
                  })
                ) : (
                  // Fallback if no cards data is available
                  <>
                    <div className="about-card">
                      <div className="icon-container">
                        <img 
                          src={aboutus1} 
                          alt="Healthcare Icon" 
                          className="about-icon" 
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 7h-3a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Z'/%3E%3Cpath d='M14 14H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h3'/%3E%3Cline x1='9' x2='9' y1='4' y2='12'/%3E%3Cline x1='14' x2='14' y1='8' y2='12'/%3E%3C/svg%3E";
                          }}
                        />
                      </div>
                      <h2>High Quality Healthcare</h2>
                      <p>No data available</p>
                    </div>
                    <div className="about-card">
                      <div className="icon-container">
                        <img 
                          src={aboutus2} 
                          alt="Pricing Icon" 
                          className="about-icon"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 2v20'/%3E%3Cpath d='M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6'/%3E%3C/svg%3E";
                          }}
                        />
                      </div>
                      <h2>High Quality Treatment</h2>
                      <p>No data available</p>
                    </div>
                    <div className="about-card">
                      <div className="icon-container">
                        <img 
                          src={aboutus3} 
                          alt="Management Icon" 
                          className="about-icon"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z'/%3E%3Cpath d='M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z'/%3E%3C/svg%3E";
                          }}
                        />
                      </div>
                      <h2>Well Management</h2>
                      <p>No data available</p>
                    </div>
                  </>
                )}
              </div>

              {/* <div className="history-content">
                {historyData.paragraphs && historyData.paragraphs.length > 0 ? (
                  historyData.paragraphs.map((paragraph, index) => (
                    <div className="history-card" key={index}>
                      <div dangerouslySetInnerHTML={{ __html: paragraph }} />
                    </div>
                  ))
                ) : (
                  <div className="history-card">
                    {historyData.history && (
                      <div dangerouslySetInnerHTML={{ __html: historyData.history }} />
                    )}
                  </div>
                )}
              </div> */}

              {/* Our Objectives Section */}
              <div className="our-objectives-section">
                <div className="objectives-header">
                  <div className="hospital-label">MAHAVIR HOSPITALS</div>
                  <h2>Our Objectives</h2>
                  <p className="objectives-intro">
                    We are ready to provide you with any Medical, health and fitness help as well as prepare a business plan. We are ready to provide you with any Medical, health and fitness help as well as prepare a business plan.
                  </p>
                </div>
                
                <div className="objectives-list">
                  <div className="objective-item">
                    <span className="objective-icon">✓</span>
                    <p>To Provide Very Comprehensive Medical Care In A Timely Manner To All Patients By Very Competent Specialist In That Field, Best In Surat, 24 Hours A Day & 7days In A Week.</p>
                  </div>
                  
                  <div className="objective-item">
                    <span className="objective-icon">✓</span>
                    <p>This Hospital Is Designated As Tertiary Referral Center For Trauma Patient Of All Walks Of Life Only Because Of Our Objective Of Having The Best General Surgeons, Ortho Surgeons, Neuro Surgeons Available At All Times To Deal With Any Or All Emergencies.</p>
                  </div>
                  
                  <div className="objective-item">
                    <span className="objective-icon">✓</span>
                    <p>To Provide State Of The Art Care At The Most Economical & Comparative Cost.</p>
                  </div>
                  
                  <div className="objective-item">
                    <span className="objective-icon">✓</span>
                    <p>To Provide The Best Quality Of Care To All Patient Regardless Of Their Social & Financial Status In Cleanest Environment.</p>
                  </div>
                  
                  <div className="objective-item">
                    <span className="objective-icon">✓</span>
                    <p>By Providing Such Quality & Comprehensive Care, We Are Striving To Achieve The Lowest Morbidity & Mortality Rate For A Tertiary Referral Center.</p>
                  </div>
                  
                  <div className="objective-item">
                    <span className="objective-icon">✓</span>
                    <p>To Be Pioneer, Provider Of All Diagnosis & Therapeutic Procedures Such As Arterial Immunization, Coiling For Aneurysms.</p>
                  </div>
                </div>
                
                <div className="chairman-section">
                  <h3>Smt. Rupaben Mehta</h3>
                  <div className="chairman-title">CHAIR PERSON</div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AboutUs;