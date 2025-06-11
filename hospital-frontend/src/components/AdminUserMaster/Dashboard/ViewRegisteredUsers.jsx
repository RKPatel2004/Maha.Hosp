import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ViewRegisteredUsers.css';
import Sidebar from '../AdminUserMasterSideBar/sidebar';
import defaultDP from '../../../assets/ProfilePhoto/default_dp.png';

const ViewRegisteredUsers = () => {
    const [users, setUsers] = useState([]);
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
        fetchAllUsers();
    }, []);

    const fetchAllUsers = async () => {
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
                'http://localhost:5000/MahavirHospital/api/patients',
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data && response.data.success) {
                setUsers(response.data.data || []);
            } else {
                setUsers([]);
                setErrorMsg('Failed to fetch users data.');
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch users';
            setErrorMsg(errorMessage);
            setUsers([]);
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

            // If no search parameters, fetch all users
            if (Object.keys(searchBody).length === 0) {
                await fetchAllUsers();
                return;
            }

            const response = await axios.post(
                'http://localhost:5000/MahavirHospital/api/filter-patients',
                searchBody,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data && response.data.success) {
                setUsers(response.data.data || []);
            } else {
                setUsers([]);
                setErrorMsg('No users found matching the search criteria.');
            }
        } catch (error) {
            console.error('Error searching users:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Search failed';
            setErrorMsg(errorMessage);
            setUsers([]);
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
        fetchAllUsers();
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
        <div className="view-users-layout">
            <Sidebar activeMenuItem="user-registration" />
            <div className="view-users-container">
                <div className="view-users-header">
                    <div className="header-nav">
                        <span className="nav-icon">👁</span>
                        <span className="nav-text">View</span>
                    </div>
                    <h1 className="page-title">View User Registration</h1>
                </div>

                <div className="search-section">
                    <div className="search-fields">
                        <div className="field-group">
                            <label htmlFor="userName">Name</label>
                            <input
                                type="text"
                                id="userName"
                                name="UserName"
                                placeholder="Enter Name"
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
                        <button onClick={fetchAllUsers} className="retry-btn">
                            Retry
                        </button>
                    </div>
                )}

                <div className="users-table-section">
                    {loading ? (
                        <div className="loading">Loading users...</div>
                    ) : (
                        <div className="table-container">
                            <table className="users-table">
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
                                    {users.length > 0 ? (
                                        users.map((user, index) => (
                                            <tr key={user._id || index}>
                                                <td>{index + 1}</td>
                                                <td>{user.UserName || 'N/A'}</td>
                                                <td>{user.MobileNo || 'N/A'}</td>
                                                <td>{user.EmailID || 'N/A'}</td>
                                                <td>{user.Pincode || 'N/A'}</td>
                                                <td>
                                                    <img
                                                        src={getProfileImage(user.FilePath)}
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
                                                No users found
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

export default ViewRegisteredUsers;