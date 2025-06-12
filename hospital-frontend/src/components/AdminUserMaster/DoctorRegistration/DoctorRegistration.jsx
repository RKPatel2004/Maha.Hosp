import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './DoctorRegistration.css';
import Sidebar from '../AdminUserMasterSideBar/sidebar';
import ViewDoctors from './ViewDoctors';

const DoctorRegistration = ({ editMobileNo, onBackToView }) => {
  const [searchMobile, setSearchMobile] = useState('');
  const [doctorData, setDoctorData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('manage');
  const [isEditMode, setIsEditMode] = useState(false);
  const [editDoctorId, setEditDoctorId] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    UserName: '',
    UserPassword: '',
    ConfirmUserPassword: '',
    MobileNo: '',
    Pincode: '',
    EmailID: '',
    Address: '',
    FilePath: null
  });
  
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  // Handle edit mode initialization
  useEffect(() => {
    if (editMobileNo) {
      setIsEditMode(true);
      setSearchMobile(editMobileNo);
      fetchDoctorForEdit(editMobileNo);
    }
  }, [editMobileNo]);

  // Auto-clear messages after 3 seconds
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess('');
        setError('');
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  // Get auth token from sessionStorage
  const getAuthToken = () => {
    return sessionStorage.getItem('adminToken') || sessionStorage.getItem('authToken');
  };

  // Updated fetchDoctorForEdit function to use the correct API endpoint
  const fetchDoctorForEdit = async (mobileNo) => {
    setLoading(true);
    setError('');
    
    try {
      const token = getAuthToken();
      
      if (!token) {
        setError('Authentication token not found. Please login again.');
        setLoading(false);
        return;
      }

      console.log('Fetching doctor data for mobile:', mobileNo); // Debug log

      const response = await fetch('http://localhost:5000/MahavirHospital/api/filter-doctors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          MobileNo: mobileNo
        })
      });

      if (response.status === 403) {
        setError('Access denied. Please check your authentication.');
        setLoading(false);
        return;
      }

      const result = await response.json();
      console.log('Filter doctors response:', result); // Debug log
      
      if (result.success && result.data && result.data.length > 0) {
        const doctor = result.data[0]; // Get first doctor
        setDoctorData(result.data);
        setEditDoctorId(doctor._id);
        
        // Populate form with doctor data
        setFormData({
          UserName: doctor.UserName || '',
          UserPassword: '', // Don't pre-fill password for security
          ConfirmUserPassword: '',
          MobileNo: doctor.MobileNo || '',
          Pincode: doctor.Pincode || '',
          EmailID: doctor.EmailID || '',
          Address: doctor.Address || '',
          FilePath: null // Handle file separately
        });

        // Set preview image if exists
        if (doctor.FilePath && doctor.FilePath !== "N/A") {
          setPreviewImage(`http://localhost:5000/${doctor.FilePath}`);
        }
      } else {
        setError('Doctor not found with this mobile number');
        setDoctorData([]);
      }
    } catch (err) {
      console.error('Error fetching doctor data:', err); // Debug log
      setError('Error fetching doctor data: ' + err.message);
      setDoctorData([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle tab navigation
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  // Handle search/fetch doctor data
  const handleFetchData = async () => {
    if (!searchMobile.trim()) {
      setError('Please enter a mobile number');
      return;
    }

    if (searchMobile.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const token = getAuthToken();
      
      if (!token) {
        setError('Authentication token not found. Please login again.');
        setLoading(false);
        return;
      }

      // Use filter-doctors API for consistency
      const response = await fetch('http://localhost:5000/MahavirHospital/api/filter-doctors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          MobileNo: searchMobile
        })
      });

      if (response.status === 403) {
        setError('Access denied. Please check your authentication.');
        setLoading(false);
        return;
      }

      const result = await response.json();
      
      if (result.success) {
        setDoctorData(result.data);
        if (result.data.length === 0) {
          setError('No doctors found with this mobile number');
        }
      } else {
        setError(result.message || 'Failed to fetch doctor data');
        setDoctorData([]);
      }
    } catch (err) {
      setError('Error fetching data: ' + err.message);
      setDoctorData([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle reset search
  const handleResetSearch = () => {
    setDoctorData([]);
    setSearchMobile('');
    setError('');
    setIsEditMode(false);
    setEditDoctorId(null);
    clearFormFields();
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Validate mobile number input
    if (name === 'MobileNo' && value.length > 10) {
      return;
    }
    
    // Validate pincode input
    if (name === 'Pincode' && value.length > 6) {
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle file upload
  const handleFileSelect = (file) => {
    if (file && file.type.startsWith('image/')) {
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size should be less than 5MB');
        return;
      }
      
      setFormData(prev => ({
        ...prev,
        FilePath: file
      }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setError('Please select a valid image file');
    }
  };

  // Handle drag and drop
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  // Clear all form fields
  const clearFormFields = () => {
    setFormData({
      UserName: '',
      UserPassword: '',
      ConfirmUserPassword: '',
      MobileNo: '',
      Pincode: '',
      EmailID: '',
      Address: '',
      FilePath: null
    });
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validation
    if (!formData.UserName.trim() || !formData.EmailID.trim() || !formData.MobileNo.trim()) {
      setError('Please fill all required fields');
      setLoading(false);
      return;
    }

    // Password validation only for new registration
    if (!isEditMode && (!formData.UserPassword || !formData.ConfirmUserPassword)) {
      setError('Please fill password fields');
      setLoading(false);
      return;
    }

    if (formData.MobileNo.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      setLoading(false);
      return;
    }

    // Password match validation only if passwords are provided
    if (formData.UserPassword && formData.UserPassword !== formData.ConfirmUserPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.EmailID)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      const token = getAuthToken();
      
      if (!token) {
        setError('Authentication token not found. Please login again.');
        setLoading(false);
        return;
      }

      const formDataToSend = new FormData();
      
      // Append all form fields
      Object.keys(formData).forEach(key => {
        if (key === 'FilePath' && formData[key]) {
          formDataToSend.append('FilePath', formData[key]);
        } else if (key !== 'FilePath') {
          // Only append password fields if they have values
          if ((key === 'UserPassword' || key === 'ConfirmUserPassword') && !formData[key]) {
            return;
          }
          formDataToSend.append(key, formData[key]);
        }
      });

      let response;

      if (isEditMode) {
        // Use PUT request with axios for edit-doctor endpoint
        response = await axios.put(
          'http://localhost:5000/MahavirHospital/api/edit-doctor',
          formDataToSend,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
      } else {
        // Use existing fetch for registration
        response = await fetch('http://localhost:5000/MahavirHospital/api/register-doctor', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formDataToSend
        });
      }

      let result;
      
      if (isEditMode) {
        // Handle axios response
        if (response.status === 403) {
          setError('Access denied. Please check your authentication.');
          setLoading(false);
          return;
        }
        result = response.data;
      } else {
        // Handle fetch response
        if (response.status === 403) {
          setError('Access denied. Please check your authentication.');
          setLoading(false);
          return;
        }
        result = await response.json();
      }
      
      if (result.success) {
        setSuccess(isEditMode ? 'Doctor updated successfully!' : 'Doctor registered successfully!');
        if (!isEditMode) {
          clearFormFields();
        }
        
        // If in edit mode, refresh the doctor data
        if (isEditMode) {
          setTimeout(() => {
            fetchDoctorForEdit(formData.MobileNo);
          }, 1000);
        }
      } else {
        setError(result.message || `Failed to ${isEditMode ? 'update' : 'register'} doctor`);
      }
    } catch (err) {
      console.error(`Error ${isEditMode ? 'updating' : 'registering'} doctor:`, err);
      setError(`Error ${isEditMode ? 'updating' : 'registering'} doctor: ` + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (isEditMode && onBackToView) {
      onBackToView();
    } else {
      clearFormFields();
      setError('');
      setSuccess('');
      setIsEditMode(false);
      setEditDoctorId(null);
    }
  };

  // If View tab is active, render ViewDoctors component
  if (activeTab === 'view') {
    return <ViewDoctors />;
  }

  return (
    <div className="doctor-registration-container">
      <Sidebar />
      
      <div className="main-content">
        <div className="content-wrapper">
          <h1 className="page-title">
            {isEditMode ? 'Edit Doctor' : 'Manage Doctor Registration'}
          </h1>

          {/* Tab Navigation - Always show but disable when in edit mode from ViewDoctors */}
          <div className="tab-navigation">
            <button 
              className={`tab-btn ${activeTab === 'manage' ? 'active' : ''}`}
              onClick={() => handleTabClick('manage')}
            >
              Manage
            </button>
            <button 
              className={`tab-btn ${activeTab === 'view' ? 'active' : ''}`}
              onClick={() => handleTabClick('view')}
            >
              View
            </button>
          </div>

          {/* Back button when in edit mode from ViewDoctors */}
          {editMobileNo && onBackToView && (
            <div className="back-navigation">
              <button 
                className="back-btn"
                onClick={onBackToView}
              >
                ← Back to View Doctors
              </button>
            </div>
          )}

          <div className="layout">
            {/* Left Side - Search and Table */}
            <div className="left-section">
              <div className="search-section">
                <label htmlFor="mobileSearch">Mobile No. *</label>
                <div className="search-container">
                  <div className="DR-mobile-input">
                    <span className="country-code">+91</span>
                    <input
                      id="mobileSearch"
                      type="text"
                      placeholder="Enter Mobile No"
                      value={searchMobile}
                      onChange={(e) => setSearchMobile(e.target.value.replace(/\D/g, ''))}
                      maxLength="10"
                      disabled={isEditMode}
                    />
                  </div>
                  {!isEditMode && (
                    <>
                      <button 
                        className="fetch-btn"
                        onClick={handleFetchData}
                        disabled={loading}
                      >
                        {loading ? 'Loading...' : 'Fetch Data'}
                      </button>
                      <button 
                        className="reset-btn"
                        onClick={handleResetSearch}
                      >
                        Reset
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Data Table */}
              {doctorData.length > 0 && (
                <div className="table-container">
                  <table className="doctor-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Registration Date</th>
                        <th>Mobile No</th>
                        <th>Pincode</th>
                        <th>Email</th>
                        <th>Address</th>
                        <th>Profile</th>
                      </tr>
                    </thead>
                    <tbody>
                      {doctorData.map((doctor, index) => (
                        <tr key={index}>
                          <td>{doctor.UserName}</td>
                          <td>{new Date(doctor.RegistrationDate).toLocaleDateString()}</td>
                          <td>{doctor.MobileNo}</td>
                          <td>{doctor.Pincode || 'N/A'}</td>
                          <td>{doctor.EmailID}</td>
                          <td>{doctor.Address || 'N/A'}</td>
                          <td>
                            {doctor.FilePath && doctor.FilePath !== "N/A" ? (
                              <img 
                                src={`http://localhost:5000/${doctor.FilePath}`} 
                                alt="Profile" 
                                className="profile-thumb"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                }}
                              />
                            ) : (
                              'No Image'
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Right Side - Registration Form */}
            <div className="right-section">
              <div className="form-container">
                {/* File Upload Area */}
                <div 
                  className={`file-upload-area ${dragActive ? 'drag-active' : ''}`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {previewImage ? (
                    <div className="preview-container">
                      <img src={previewImage} alt="Preview" className="preview-image" />
                      <div className="preview-overlay">
                        <span>Click to change</span>
                      </div>
                    </div>
                  ) : (
                    <div className="upload-placeholder">
                      <div className="upload-icon">📁</div>
                      <p>Drop Profile Image</p>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileInput}
                    style={{ display: 'none' }}
                  />
                </div>

                {/* Registration Form */}
                <form onSubmit={handleSubmit} className="registration-form">
                  <div className="form-group">
                    <label>Mobile No *</label>
                    <input
                      type="text"
                      name="MobileNo"
                      placeholder="Enter Mobile No"
                      value={formData.MobileNo}
                      onChange={handleInputChange}
                      maxLength="10"
                      required
                      disabled={isEditMode}
                    />
                  </div>

                  <div className="form-group">
                    <label>Name *</label>
                    <input
                      type="text"
                      name="UserName"
                      placeholder="Enter Name"
                      value={formData.UserName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Password {!isEditMode ? '*' : '(Leave blank to keep current)'}</label>
                    <input
                      type="password"
                      name="UserPassword"
                      placeholder={isEditMode ? "Enter new password (optional)" : "Enter Password"}
                      value={formData.UserPassword}
                      onChange={handleInputChange}
                      required={!isEditMode}
                    />
                  </div>

                  <div className="form-group">
                    <label>Confirm Password {!isEditMode ? '*' : ''}</label>
                    <input
                      type="password"
                      name="ConfirmUserPassword"
                      placeholder={isEditMode ? "Confirm new password" : "Enter Confirm Password"}
                      value={formData.ConfirmUserPassword}
                      onChange={handleInputChange}
                      required={!isEditMode}
                    />
                  </div>

                  <div className="form-group">
                    <label>Pincode</label>
                    <input
                      type="text"
                      name="Pincode"
                      placeholder="Enter Pincode"
                      value={formData.Pincode}
                      onChange={handleInputChange}
                      maxLength="6"
                    />
                  </div>

                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      name="EmailID"
                      placeholder="Enter Email"
                      value={formData.EmailID}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Address</label>
                    <textarea
                      name="Address"
                      placeholder="Enter Address"
                      value={formData.Address}
                      onChange={handleInputChange}
                      rows="3"
                    />
                  </div>

                  {/* Messages above buttons - Only show if there's an error or success message */}
                  {(error || success) && (
                    <div className="form-messages">
                      {error && <div className="form-message error-message">{error}</div>}
                      {success && <div className="form-message success-message">{success}</div>}
                    </div>
                  )}

                  <div className="form-buttons">
                    <button 
                      type="submit" 
                      className="submit-btn"
                      disabled={loading}
                    >
                      {loading ? (isEditMode ? 'Updating...' : 'Submitting...') : (isEditMode ? 'Update' : 'Submit')}
                    </button>
                    <button 
                      type="button" 
                      className="cancel-btn"
                      onClick={handleCancel}
                    >
                      {isEditMode && editMobileNo ? 'Back' : 'Cancel'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorRegistration;