import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../AdminUserMasterSideBar/sidebar';
import DoctorRegistration from './DoctorRegistration';
import './ViewDoctors.css';

const ViewDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('view');
  const [editMobileNo, setEditMobileNo] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const token = sessionStorage.getItem('adminToken') || sessionStorage.getItem('authToken');
        const response = await axios.get('http://localhost:5000/MahavirHospital/api/doctors', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.data.success) {
          setDoctors(response.data.data);
        } else {
          setError('Failed to fetch doctors data');
        }
      } catch (err) {
        setError('Error fetching doctors: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // Handle tab navigation
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    // Reset edit mode when switching tabs
    if (tab === 'view') {
      setEditMobileNo(null);
    }
  };

  // Corrected handleEdit function to use the specific doctor's mobile number
  const handleEdit = (doctor) => {
    // Use the mobile number from the specific doctor row
    const mobileNo = doctor.MobileNo || doctor.mobile;
    console.log('Editing doctor with mobile:', mobileNo); // Debug log
    setEditMobileNo(mobileNo);
    setActiveTab('manage');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB'); // DD/MM/YYYY format
  };

  // If Manage tab is active, render DoctorRegistration component
  if (activeTab === 'manage') {
    return (
      <DoctorRegistration 
        editMobileNo={editMobileNo}
        onBackToView={() => {
          setActiveTab('view');
          setEditMobileNo(null);
        }}
      />
    );
  }

  if (loading) {
    return (
      <div className="VD-doctor-registration-container">
        <Sidebar />
        <div className="VD-main-content">
          <div className="VD-content-wrapper">
            <h1 className="VD-page-title">Manage Doctor Registration</h1>
            
            {/* Tab Navigation */}
            <div className="VD-tab-navigation">
              <button 
                className={`VD-tab-btn ${activeTab === 'manage' ? 'VD-active' : ''}`}
                onClick={() => handleTabClick('manage')}
              >
                Manage
              </button>
              <button 
                className={`VD-tab-btn ${activeTab === 'view' ? 'VD-active' : ''}`}
                onClick={() => handleTabClick('view')}
              >
                View
              </button>
            </div>
            
            <div className="VD-loading-message">
              Loading doctors...
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="VD-doctor-registration-container">
        <Sidebar />
        <div className="VD-main-content">
          <div className="VD-content-wrapper">
            <h1 className="VD-page-title">Manage Doctor Registration</h1>
            
            {/* Tab Navigation */}
            <div className="VD-tab-navigation">
              <button 
                className={`VD-tab-btn ${activeTab === 'manage' ? 'VD-active' : ''}`}
                onClick={() => handleTabClick('manage')}
              >
                Manage
              </button>
              <button 
                className={`VD-tab-btn ${activeTab === 'view' ? 'VD-active' : ''}`}
                onClick={() => handleTabClick('view')}
              >
                View
              </button>
            </div>
            
            <div className="VD-error-message">
              Error: {error}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="VD-doctor-registration-container">
      <Sidebar />
      
      <div className="VD-main-content">
        <div className="VD-content-wrapper">
          <h1 className="VD-page-title">Manage Doctor Registration</h1>

          {/* Tab Navigation */}
          <div className="VD-tab-navigation">
            <button 
              className={`VD-tab-btn ${activeTab === 'manage' ? 'VD-active' : ''}`}
              onClick={() => handleTabClick('manage')}
            >
              Manage
            </button>
            <button 
              className={`VD-tab-btn ${activeTab === 'view' ? 'VD-active' : ''}`}
              onClick={() => handleTabClick('view')}
            >
              View
            </button>
          </div>

          <div className="VD-view-doctors-section">
            <div className="VD-section-header">
              <h2>Registered Doctors ({doctors.length})</h2>
            </div>
            
            <div className="VD-doctors-table-container">
              <table className="VD-doctors-table">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Name</th>
                    <th>Registration Date</th>
                    <th>Mobile No</th>
                    <th>Email ID</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {doctors.map((doctor, index) => (
                    <tr key={doctor._id || index}>
                      <td>{index + 1}</td>
                      <td>
                        <div className="VD-doctor-info">
                          {/* <div className="VD-doctor-avatar">
                            {doctor.FilePath && doctor.FilePath !== "N/A" ? (
                              <img 
                                src={`http://localhost:5000/${doctor.FilePath}`} 
                                alt="Profile" 
                                className="VD-avatar-image"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                }}
                              />
                            ) : (
                              <div className="VD-avatar-placeholder">
                                {(doctor.UserName || doctor.name || 'U').charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div> */}
                          <span className="VD-doctor-name">
                            {doctor.UserName || doctor.name}
                          </span>
                        </div>
                      </td>
                      <td>{formatDate(doctor.RegistrationDate || doctor.registrationDate)}</td>
                      <td>{doctor.MobileNo || doctor.mobile}</td>
                      <td>{doctor.EmailID || doctor.email}</td>
                      <td>
                        <button 
                          className="VD-edit-btn"
                          onClick={() => handleEdit(doctor)}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {doctors.length === 0 && (
              <div className="VD-no-doctors-message">
                <p>No doctors registered yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewDoctors;