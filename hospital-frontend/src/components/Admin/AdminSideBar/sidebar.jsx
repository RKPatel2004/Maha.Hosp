import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./sidebar.css";
import MahavirLogo from "../../../assets/Mahavir/mahavir_icon.png";
import DashboardIcon from "../../../assets/Admin_icons/dashboard_icon.png";
import EditProfileIcon from "../../../assets/Admin_icons/edit_profile_icon.png";
import FeedbackIcon from "../../../assets/Admin_icons/feedback_icon.png";
import RelationIcon from "../../../assets/Admin_icons/relation_icon.png";
import ReportIcon from "../../../assets/Admin_icons/report_icon.png";
import LogoutIcon from "../../../assets/Admin_icons/logout_icon.png";

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(true);
    const [activeItem, setActiveItem] = useState('dashboard');

    const menuItems = [
        {
            id: 'dashboard',
            label: 'Dashboard',
            icon: DashboardIcon,
            path: '/admin/dashboard'
        },
        {
            id: 'edit-profile',
            label: 'Edit Profile',
            icon: EditProfileIcon,
            path: '/admin/edit-profile'
        },
        {
            id: 'give-feedback',
            label: 'Give Feedback',
            icon: FeedbackIcon,
            path: '/admin/feedback'
        },
        {
            id: 'map-relations',
            label: 'Map Relations',
            icon: RelationIcon,
            path: '/admin/map-relations'
        },
        {
            id: 'report-investigation',
            label: 'Report Of Investigation',
            icon: ReportIcon,
            path: '/admin/report'
        },
        {
            id: 'logout',
            label: 'Log Out',
            icon: LogoutIcon,
            path: '/logout'
        }
    ];

    useEffect(() => {
        window.scrollTo(0, 0);
        
        // Set active item based on current path
        const currentPath = location.pathname;
        const currentItem = menuItems.find(item => item.path === currentPath);
        if (currentItem) {
            setActiveItem(currentItem.id);
        } else if (currentPath === '/admin') {
            setActiveItem('dashboard');
        }
    }, [location.pathname]);

    const handleItemClick = (itemId) => {
        const selectedItem = menuItems.find(item => item.id === itemId);
        
        if (selectedItem) {
            if (itemId === 'logout') {
                // Handle logout logic
                const confirmLogout = window.confirm('Are you sure you want to log out?');
                if (confirmLogout) {
                    // Clear user session/token if needed
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('userInfo');
                    
                    // Navigate to logout/login page
                    navigate(selectedItem.path, { replace: true });
                }
            } else {
                // Set active item first
                setActiveItem(itemId);
                // Navigate to the selected path (just change URL, same component renders)
                navigate(selectedItem.path, { replace: true });
            }
        }
        
        console.log(`Navigating to: ${selectedItem?.path || 'Unknown path'} for item: ${itemId}`);
    };

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
            <div className="sidebar-header">
                <button className="toggle-button" onClick={toggleSidebar}>
                    <div className={`arrow ${isOpen ? 'left' : 'right'}`}></div>
                </button>
                <div>
                    <div className="logo-container">
                        {isOpen ? <img
                            src={MahavirLogo}
                            onClick={() => navigate('/admin/dashboard')}
                            alt="Mahavir Hospitals Logo"
                            className="logo"
                        /> : ""}
                        <div className="hospital-info">
                            <h2 className="hospital-name">{isOpen ? "MAHAVIR HOSPITALS" : ""}</h2>
                        </div>
                    </div>
                </div>
            </div>

            <nav className="sidebar-nav">
                <ul className="menu-list">
                    {menuItems.map((item) => (
                        <li key={item.id} className="menu-item">
                            <button
                                className={`menu-button ${activeItem === item.id ? 'active' : ''}`}
                                onClick={() => handleItemClick(item.id)}
                            >
                                <img 
                                    src={item.icon} 
                                    alt={`${item.label} icon`} 
                                    className="menu-icon"
                                />
                                <span className="menu-label">{isOpen ? item.label : ""}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;