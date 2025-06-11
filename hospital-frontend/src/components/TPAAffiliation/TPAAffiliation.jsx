import React, { useEffect, useState } from 'react';
import './TPAAffiliation.css';
import Navbar from '../header_footer/navbar';
import Footer from '../header_footer/footer';

// Dynamically require all images from assets/home/TPAAffiliation
const images = require.context('../../assets/home/TPAAffiliation', false, /\.(png|jpe?g|svg)$/);

const TPAAffiliation = () => {
  const [affiliations, setAffiliations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    fetch('http://localhost:5000/MahavirHospital/api/TPAAffiliation')
      .then(res => res.json())
      .then(data => {
        setAffiliations(Array.isArray(data.data) ? data.data : []);
        setLoading(false);
      })
      .catch(() => {
        setAffiliations([]);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <div className="navbar-wrapper">
        <Navbar />
      </div>
      <div className="tpa-affiliation-page">
        <div className="tpa-header-section">
          <h1 className="tpa-title">TPA Affiliation</h1>
          <div className="tpa-breadcrumbs">
            <a href="/">Home</a> / <a href="/about-us">About Us</a> / <span className="active">TPA Affiliation</span>
          </div>
        </div>
        <div className="tpa-content-section">
          <h2 className="tpa-section-title">TPA Services</h2>
          <p className="tpa-description">
            As a patient seeking medical treatments in a hospital, you might be interested in knowing about cashless mediclaim. We have tie-ups with various insurance companies for easy payments and would be glad to discuss payment options with your insurance provider, in case your policy covers services rendered away from your place of residence. The Insured is entitled for cashless access at the provider for all such ailments which are covered under the medical/health insurance policy sum insured limit/sub limits i.e. not specifically excluded under the policy.
          </p>
          <p className="tpa-description">
            Mentioned below are the TPA insurance providers associated with Mahavir Hospital.
          </p>
          {loading ? (
            <div className="tpa-loading">Loading...</div>
          ) : (
            <div className="tpa-grid">
              {affiliations.map((item, idx) => {
                let imageSrc = '';
                try {
                  imageSrc = images(`./${item.Logo}`);
                } catch {
                  imageSrc = '';
                }
                return (
                  <div className="tpa-grid-item" key={idx}>
                    {imageSrc ? (
                      <img src={imageSrc} alt={item.CompanyName} className="tpa-logo" />
                    ) : (
                      <div className="tpa-logo-placeholder">No Image</div>
                    )}
                    <div className="tpa-company-name">{item.CompanyName}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TPAAffiliation;
