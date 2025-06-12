import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../AdminSideBar/sidebar';
import './editprofile.css';

const EditProfile = () => {
    const navigate = useNavigate();
    const [userProfile, setUserProfile] = useState({
        userName: '',
        emailId: '',
        address: '',
        pincode: '',
        filePath: '',
        mobileNo: ''
    });
    const [originalProfile, setOriginalProfile] = useState({});
    const [profileImage, setProfileImage] = useState(null);
    const [previewImage, setPreviewImage] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [cancelMessage, setCancelMessage] = useState('');
    const [showUserMenu, setShowUserMenu] = useState(false);

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const token = sessionStorage.getItem('authToken');
            if (!token) {
                navigate('/home');
                return;
            }

            const response = await axios.get('http://localhost:5000/MahavirHospital/api/get-user-profile', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.success) {
                const data = response.data.data;
                const profileData = {
                    userName: data.userName || '',
                    emailId: data.emailId || '',
                    address: data.address || '',
                    pincode: data.pincode || '',
                    filePath: data.filePath || '',
                    mobileNo: data.mobileNo || ''
                };
                setUserProfile(profileData);
                setOriginalProfile(profileData);

                if (data.filePath) {
                    setPreviewImage(`http://localhost:5000/${data.filePath.replace(/\\/g, '/')}`);
                } else {
                    setPreviewImage('/assets/ProfilePhoto/default_dp.png');
                }
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
            if (error.response?.status === 401) {
                handleLogout();
            }
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserProfile(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            // Clear any existing messages
            setSuccessMessage('');
            setCancelMessage('');
            
            const token = sessionStorage.getItem('authToken');

            const formData = new FormData();
            formData.append('UserName', userProfile.userName);
            formData.append('EmailID', userProfile.emailId);
            formData.append('Address', userProfile.address);
            formData.append('Pincode', userProfile.pincode);

            if (profileImage) {
                formData.append('imagePath', profileImage);
            }

            const response = await axios.put(
                'http://localhost:5000/MahavirHospital/api/edit-user-profile',
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            if (response.data.success) {
                setSuccessMessage('Profile updated successfully!');
                const updatedData = response.data.data;
                const newProfileData = {
                    userName: updatedData.userName || '',
                    emailId: updatedData.emailId || '',
                    address: updatedData.address || '',
                    pincode: updatedData.pincode || '',
                    filePath: updatedData.filePath || '',
                    mobileNo: updatedData.mobileNo || ''
                };
                setOriginalProfile(newProfileData);
                setUserProfile(newProfileData);

                if (updatedData.filePath) {
                    setPreviewImage(`http://localhost:5000/${updatedData.filePath.replace(/\\/g, '/')}`);
                } else {
                    setPreviewImage('/assets/ProfilePhoto/default_dp.png');
                }

                setProfileImage(null);

                setTimeout(() => {
                    setSuccessMessage('');
                }, 3000);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setSuccessMessage('Error updating profile. Please try again.');
            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        // Clear any existing messages
        setSuccessMessage('');
        setCancelMessage('');
        
        setUserProfile(originalProfile);
        setProfileImage(null);
        if (originalProfile.filePath) {
            setPreviewImage(`http://localhost:5000/${originalProfile.filePath.replace(/\\/g, '/')}`);
        } else {
            setPreviewImage('/assets/ProfilePhoto/default_dp.png');
        }
        
        setCancelMessage('Changes cancelled successfully!');
        setTimeout(() => {
            setCancelMessage('');
        }, 3000);
    };

    const handleLogout = () => {
        sessionStorage.removeItem('authToken');
        navigate('/home');
    };

    const triggerFileInput = () => {
        document.getElementById('profileImageInput').click();
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="edit-profile-container">
            <Sidebar />

            <div className="main-content">
                {/* Header */}
                <div className="header">
                    <div className="breadcrumb">
                        <span>🏠</span>
                        <span> &gt; Edit Profile</span>
                    </div>

                    <div className="user-profile-header">
                        <div
                            className="profile-avatar"
                            onMouseEnter={() => setShowUserMenu(true)}
                            onMouseLeave={() => setShowUserMenu(false)}
                        >
                            <img
                                src={previewImage || '/assets/ProfilePhoto/default_dp.png'}
                                alt="Profile"
                            />
                            {showUserMenu && (
                                <div className="user-menu">
                                    <div className="username">{userProfile.userName}</div>
                                    <button onClick={handleLogout} className="logout-btn">
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Profile Content */}
                <div className="profile-content">
                    <div className="profile-card">
                        {/* Profile Header Section */}
                        <div className="profile-header-section">
                            <div className="profile-image-container">
                                <img
                                    src={previewImage || '/assets/ProfilePhoto/default_dp.png'}
                                    alt="Profile"
                                    className="editProfile-profile-image"
                                />
                                <button 
                                    className="upload-btn" 
                                    onClick={triggerFileInput}
                                    type="button"
                                >
                                    📷 Upload Image
                                </button>
                                <input
                                    type="file"
                                    id="profileImageInput"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    style={{ display: 'none' }}
                                />
                            </div>
                            
                            <div className="profile-basic-info">
                                <h2 className="profile-name">{userProfile.userName || 'User Name'}</h2>
                                <p className="profile-mobile">{userProfile.mobileNo || 'Mobile Number'}</p>
                            </div>
                        </div>

                        {/* Form Fields */}
                        <div className="form-section">
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="userName">
                                        User Name <span className="required">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="userName"
                                        name="userName"
                                        value={userProfile.userName}
                                        onChange={handleInputChange}
                                        placeholder="Enter your name"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="emailId">
                                        Email <span className="required">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        id="emailId"
                                        name="emailId"
                                        value={userProfile.emailId}
                                        onChange={handleInputChange}
                                        placeholder="Enter your email"
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="address">Address</label>
                                    <input
                                        type="text"
                                        id="address"
                                        name="address"
                                        value={userProfile.address}
                                        onChange={handleInputChange}
                                        placeholder="Enter your address"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="pincode">Pincode</label>
                                    <input
                                        type="text"
                                        id="pincode"
                                        name="pincode"
                                        value={userProfile.pincode}
                                        onChange={handleInputChange}
                                        placeholder="Enter pincode"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Success/Cancel Messages - Above Action Buttons */}
                        {(successMessage || cancelMessage) && (
                            <div className="action-message">
                                {successMessage && (
                                    <div className="success-message-inline">
                                        ✅ {successMessage}
                                    </div>
                                )}
                                {cancelMessage && (
                                    <div className="cancel-message-inline">
                                        ❌ {cancelMessage}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="action-buttons">
                            <button
                                className="editprofile-save-btn"
                                onClick={handleSave}
                                disabled={saving}
                            >
                                {saving ? 'Saving...' : 'Save'}
                            </button>
                            <button
                                className="editprofile-cancel-btn"
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditProfile;