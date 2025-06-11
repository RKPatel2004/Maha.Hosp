import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import './dashboard.css';
import drDashboardImage from '../../../assets/AdminUserMaster/dr-dashboard.png';
import Sidebar from '../AdminUserMasterSideBar/sidebar';

const Dashboard = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [registeredUsers, setRegisteredUsers] = useState([]);
    const [registeredDoctors, setRegisteredDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        window.scrollTo(0,0);
    });

    useEffect(() => {
        // Get admin info from token
        const token = sessionStorage.getItem('authToken');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                console.log('Decoded token:', decodedToken); // Debug log
                // Prefer userName, fallback to mobile or adminId
                setUserName(
                    decodedToken.userName ||
                    decodedToken.mobile ||
                    decodedToken.adminId ||
                    'Admin'
                );
            } catch (error) {
                console.error('Error decoding token:', error);
                setUserName('Admin');
                setErrorMsg('Invalid token. Please login again.');
            }
        } else {
            setUserName('Admin');
            setErrorMsg('No authentication token found. Please login again.');
        }

        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            setErrorMsg('');

            const token = sessionStorage.getItem('authToken');
            if (!token) {
                setErrorMsg('No authentication token found. Please login again.');
                setLoading(false);
                return;
            }

            // Debug: Check token validity
            try {
                const decodedToken = jwtDecode(token);
                console.log('Token expires at:', new Date(decodedToken.exp * 1000));
                console.log('Current time:', new Date());
                
                if (decodedToken.exp * 1000 < Date.now()) {
                    setErrorMsg('Token has expired. Please login again.');
                    setLoading(false);
                    return;
                }
            } catch (tokenError) {
                console.error('Token validation error:', tokenError);
                setErrorMsg('Invalid token format. Please login again.');
                setLoading(false);
                return;
            }

            // Axios instance with default headers
            const apiClient = axios.create({
                baseURL: 'http://localhost:5000',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            // Add request interceptor for logging
            apiClient.interceptors.request.use(request => {
                console.log('Making request to:', request.url);
                console.log('Request headers:', request.headers);
                return request;
            });

            // Add response interceptor for logging
            apiClient.interceptors.response.use(
                response => {
                    console.log('Response received:', response.status, response.data);
                    return response;
                },
                error => {
                    console.error('Response error:', error.response?.status, error.response?.data);
                    return Promise.reject(error);
                }
            );

            // Fetch registered users (patients)
            try {
                console.log('Fetching patients...');
                const usersResponse = await apiClient.get('/MahavirHospital/api/patients');
                console.log('Patients response:', usersResponse.data);
                
                if (usersResponse.data && usersResponse.data.success) {
                    setRegisteredUsers(usersResponse.data.data || []);
                } else {
                    console.warn('Patients fetch unsuccessful:', usersResponse.data);
                    setRegisteredUsers([]);
                }
            } catch (userError) {
                console.error('Error fetching patients:', userError);
                const errorMessage = userError.response?.data?.message || userError.message;
                console.error('Patient fetch error details:', errorMessage);
                setRegisteredUsers([]);
                
                // Only set error message if it's not a simple "no data" case
                if (userError.response?.status !== 404) {
                    setErrorMsg(prev => prev + ` Patients: ${errorMessage}. `);
                }
            }

            // Fetch registered doctors
            try {
                console.log('Fetching doctors...');
                const doctorsResponse = await apiClient.get('/MahavirHospital/api/doctors');
                console.log('Doctors response:', doctorsResponse.data);
                
                if (doctorsResponse.data && doctorsResponse.data.success) {
                    setRegisteredDoctors(doctorsResponse.data.data || []);
                } else {
                    console.warn('Doctors fetch unsuccessful:', doctorsResponse.data);
                    setRegisteredDoctors([]);
                }
            } catch (doctorError) {
                console.error('Error fetching doctors:', doctorError);
                const errorMessage = doctorError.response?.data?.message || doctorError.message;
                console.error('Doctor fetch error details:', errorMessage);
                setRegisteredDoctors([]);
                
                // Only set error message if it's not a simple "no data" case
                if (doctorError.response?.status !== 404) {
                    setErrorMsg(prev => prev + ` Doctors: ${errorMessage}. `);
                }
            }

        } catch (error) {
            console.error('General fetch error:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Unknown error occurred';
            setErrorMsg('Failed to fetch data. ' + errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB');
    };

    const getProfileImage = (filePath) => {
        if (!filePath) return null;
        return `http://localhost:5000/${filePath.replace(/\\/g, '/')}`;
    };

    const getDefaultAvatar = () => {
        return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%23e3f2fd'/%3E%3Cpath d='M20 20c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0 2.5c-3.33 0-10 1.67-10 5v2.5h20v-2.5c0-3.33-6.67-5-10-5z' fill='%231976d2'/%3E%3C/svg%3E";
    };

    const handleViewAllUsers = () => {
        navigate('/ViewRegisteredUsers');
    };

    const handleViewAllDoctors = () => {
        navigate('/ViewRegisteredDoctors');
    };

    return (
        <div className="dashboard-layout">
            <Sidebar activeMenuItem="dashboard" />
            <div className="dashboard-container">
                <div className="dashboard-header">
                    <div className="greeting-section">
                        <h1>Good Morning, <span className="username">{userName}</span></h1>
                        <p>Have a nice day at work. Progress is excellent!</p>
                    </div>
                    <div className="dashboard-image">
                        <img src={drDashboardImage} alt="Doctor Dashboard" />
                    </div>
                </div>

                <div className="action-buttons">
                    <button className="btn btn-primary">
                        <span>+</span> Admitted Patients
                    </button>
                    <button className="btn btn-secondary">
                        <span>+</span> OT Schedule
                    </button>
                </div>

                <div className="dashboard-content">
                    {errorMsg && (
                        <div className="error-message" style={{
                            color: 'red',
                            marginBottom: '1rem',
                            padding: '10px',
                            backgroundColor: '#ffebee',
                            border: '1px solid red',
                            borderRadius: '4px'
                        }}>
                            {errorMsg}
                            <button 
                                onClick={fetchData} 
                                style={{
                                    marginLeft: '10px',
                                    padding: '5px 10px',
                                    backgroundColor: '#f44336',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '3px',
                                    cursor: 'pointer'
                                }}
                            >
                                Retry
                            </button>
                        </div>
                    )}

                    <div className="section">
                        <div className="section-header">
                            <h2>Registered Users ({registeredUsers.length})</h2>
                            <button className="view-all-btn" onClick={handleViewAllUsers}>View All</button>
                        </div>
                        {loading ? (
                            <div className="loading">Loading users...</div>
                        ) : (
                            <div className="table-container">
                                {registeredUsers.length > 0 ? (
                                    <table className="data-table">
                                        <thead>
                                            <tr>
                                                <th>No.</th>
                                                <th>Name</th>
                                                <th>Registration Date</th>
                                                <th>Mobile No</th>
                                                <th>Email ID</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {registeredUsers.map((user, index) => (
                                                <tr key={user._id || index}>
                                                    <td>{index + 1}</td>
                                                    <td className="name-cell">
                                                        <img
                                                            src={getProfileImage(user.FilePath) || getDefaultAvatar()}
                                                            alt="Profile"
                                                            className="profile-image"
                                                            onError={(e) => {
                                                                e.target.src = getDefaultAvatar();
                                                            }}
                                                        />
                                                        <span>{user.UserName || 'N/A'}</span>
                                                    </td>
                                                    <td>{formatDate(user.RegistrationDate)}</td>
                                                    <td>{user.MobileNo || 'N/A'}</td>
                                                    <td>{user.EmailID || 'N/A'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p>No registered users found.</p>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="section">
                        <div className="section-header">
                            <h2>Registered Doctors ({registeredDoctors.length})</h2>
                            <button className="view-all-btn" onClick={handleViewAllDoctors}>View All</button>
                        </div>
                        {loading ? (
                            <div className="loading">Loading doctors...</div>
                        ) : (
                            <div className="table-container">
                                {registeredDoctors.length > 0 ? (
                                    <table className="data-table">
                                        <thead>
                                            <tr>
                                                <th>No.</th>
                                                <th>Name</th>
                                                <th>Registration Date</th>
                                                <th>Mobile No</th>
                                                <th>Email ID</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {registeredDoctors.map((doctor, index) => (
                                                <tr key={doctor._id || index}>
                                                    <td>{index + 1}</td>
                                                    <td className="name-cell">
                                                        <img
                                                            src={getProfileImage(doctor.FilePath) || getDefaultAvatar()}
                                                            alt="Profile"
                                                            className="profile-image"
                                                            onError={(e) => {
                                                                e.target.src = getDefaultAvatar();
                                                            }}
                                                        />
                                                        <span>{doctor.UserName || 'N/A'}</span>
                                                    </td>
                                                    <td>{formatDate(doctor.RegistrationDate)}</td>
                                                    <td>{doctor.MobileNo || 'N/A'}</td>
                                                    <td>{doctor.EmailID || 'N/A'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p>No registered doctors found.</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;