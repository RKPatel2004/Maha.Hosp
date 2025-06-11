import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ViewRegisteredDoctors.css';
import Sidebar from '../AdminUserMasterSideBar/sidebar';
import defaultDP from '../../../assets/ProfilePhoto/default_dp.png';

const ViewRegisteredDoctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');
    const [searchParams, setSearchParams] = useState({
        UserName: '',
        MobileNo: ''
    });

    useEffect(() => {
        window.scrollTo(0,0);
    });

    useEffect(() => {
        fetchAllDoctors();
    }, []);

    const fetchAllDoctors = async () => {
        try {
            setLoading(true);
            setErrorMsg('');

            const token = sessionStorage.getItem('authToken');
            if (!token) {
                setErrorMsg('No authentication token found. Please login again.');
                setLoading(false);
                return;
            }

            const response = await axios.get(
                'http://localhost:5000/MahavirHospital/api/doctors',
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data && response.data.success) {
                setDoctors(response.data.data || []);
            } else {
                setDoctors([]);
                setErrorMsg('Failed to fetch doctors data.');
            }
        } catch (error) {
            console.error('Error fetching doctors:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch doctors';
            setErrorMsg(errorMessage);
            setDoctors([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        try {
            setLoading(true);
            setErrorMsg('');

            const token = sessionStorage.getItem('authToken');
            if (!token) {
                setErrorMsg('No authentication token found. Please login again.');
                setLoading(false);
                return;
            }

            // Prepare search body - only include non-empty fields
            const searchBody = {};
            if (searchParams.UserName.trim()) {
                searchBody.UserName = searchParams.UserName.trim();
            }
            if (searchParams.MobileNo.trim()) {
                searchBody.MobileNo = searchParams.MobileNo.trim();
            }

            // If no search parameters, fetch all doctors
            if (Object.keys(searchBody).length === 0) {
                await fetchAllDoctors();
                return;
            }

            const response = await axios.post(
                'http://localhost:5000/MahavirHospital/api/filter-doctors',
                searchBody,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data && response.data.success) {
                setDoctors(response.data.data || []);
            } else {
                setDoctors([]);
                setErrorMsg('No doctors found matching the search criteria.');
            }
        } catch (error) {
            console.error('Error searching doctors:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Search failed';
            setErrorMsg(errorMessage);
            setDoctors([]);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setSearchParams({
            UserName: '',
            MobileNo: ''
        });
        setErrorMsg('');
        fetchAllDoctors();
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSearchParams(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const getProfileImage = (filePath) => {
        if (!filePath) return defaultDP;
        return `http://localhost:5000/${filePath.replace(/\\/g, '/')}`;
    };

    return (
        <div className="view-doctors-layout">
            <Sidebar activeMenuItem="doctor-registration" />
            <div className="view-doctors-container">
                <div className="view-doctors-header">
                    <div className="header-nav">
                        <span className="nav-icon">👨‍⚕️</span>
                        <span className="nav-text">View</span>
                    </div>
                    <h1 className="page-title">View Doctor Registration</h1>
                </div>

                <div className="search-section">
                    <div className="search-fields">
                        <div className="field-group">
                            <label htmlFor="userName">Name</label>
                            <input
                                type="text"
                                id="userName"
                                name="UserName"
                                placeholder="Enter Doctor Name"
                                value={searchParams.UserName}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="field-group">
                            <label htmlFor="mobileNo">Mobile No.</label>
                            <input
                                type="text"
                                id="mobileNo"
                                name="MobileNo"
                                placeholder="Enter Mobile No."
                                value={searchParams.MobileNo}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <div className="search-buttons">
                        <button className="search-btn" onClick={handleSearch}>
                            Search
                        </button>
                        <button className="reset-btn" onClick={handleReset}>
                            Reset
                        </button>
                    </div>
                </div>

                {errorMsg && (
                    <div className="error-message">
                        {errorMsg}
                        <button onClick={fetchAllDoctors} className="retry-btn">
                            Retry
                        </button>
                    </div>
                )}

                <div className="doctors-table-section">
                    {loading ? (
                        <div className="loading">Loading doctors...</div>
                    ) : (
                        <div className="table-container">
                            <table className="doctors-table">
                                <thead>
                                    <tr>
                                        <th>Sr. No.</th>
                                        <th>Name</th>
                                        <th>Mobile No</th>
                                        <th>Email</th>
                                        <th>Code</th>
                                        <th>Photo</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {doctors.length > 0 ? (
                                        doctors.map((doctor, index) => (
                                            <tr key={doctor._id || index}>
                                                <td>{index + 1}</td>
                                                <td>{doctor.UserName || 'N/A'}</td>
                                                <td>{doctor.MobileNo || 'N/A'}</td>
                                                <td>{doctor.EmailID || 'N/A'}</td>
                                                <td>{doctor.Pincode || 'N/A'}</td>
                                                <td>
                                                    <img
                                                        src={getProfileImage(doctor.FilePath)}
                                                        alt="Profile"
                                                        className="profile-photo"
                                                        onError={(e) => {
                                                            e.target.src = defaultDP;
                                                        }}
                                                    />
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="no-data">
                                                No doctors found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ViewRegisteredDoctors;