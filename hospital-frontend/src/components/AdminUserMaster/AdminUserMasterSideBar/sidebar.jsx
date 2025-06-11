import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './sidebar.css';
import MahavirLogo from '../../../assets/AdminUserMaster/new_mahavir_icon.png';

const menuItems = [
  { key: 'dashboard', icon: 'AdminUserMaster-icon-dashboard', label: 'Dashboard', path: '/admin-user-master/dashboard' },
  { key: 'doctor-registration', icon: 'AdminUserMaster-icon-doctor', label: 'Doctor Registration', path: '/admin-user-master/doctor-registration' },
  { key: 'department', icon: 'AdminUserMaster-icon-department', label: 'Department Directory', path: '/department' },
  {
    key: 'career', icon: 'AdminUserMaster-icon-career', label: 'Career', submenu: [
      { label: 'Career Opening', path: '/career-opening' },
      { label: 'View Career Inquiry', path: '/view-career-inquiry' },
    ]
  },
  {
    key: 'feedback', icon: 'AdminUserMaster-icon-feedback', label: 'Feedback', submenu: [
      { label: 'FeedBack Questions', path: '/feedback-questions' },
      { label: 'FeedBack Report', path: '/feedback-report' },
    ]
  },
  {
    key: 'frontpages', icon: 'AdminUserMaster-icon-pages', label: 'Front Pages', submenu: [
      { label: 'About Hospitals', path: '/about-hospitals' },
      { label: 'Health Plan', path: '/health-plan' },
      { label: 'Bulletin', path: '/bulletin' },
      { label: 'TPA Affiliation', path: '/tpa-affiliation' },
      { label: 'Mission / Vision', path: '/mission-vision' },
    ]
  },
  { key: 'user-rights', icon: 'AdminUserMaster-icon-user', label: 'User Rights', path: '/user-rights' },
  {
    key: 'policies', icon: 'AdminUserMaster-icon-policies', label: 'Policies', submenu: [
      { label: 'Privacy Policy', path: '/privacy-policy' },
      { label: 'Visitor Policy', path: '/visitor-policy' },
      { label: 'Terms Condition', path: '/terms-condition' },
    ]
  },
  { key: 'logout', icon: 'AdminUserMaster-icon-logout', label: 'Logout', path: '/logout' },
];

const Sidebar = ({ activeMenuItem = null }) => {
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [activeItem, setActiveItem] = useState(activeMenuItem);
  const navigate = useNavigate();

  const handleSubmenu = (key) => {
    setActiveSubmenu(activeSubmenu === key ? null : key);
    setActiveItem(key);
  };

  const handleMenuClick = (key, path) => {
    setActiveItem(key);
    navigate(path);
  };

  const handleSubmenuClick = (path) => {
    navigate(path);
  };

  return (
    <div className="AdminUserMaster-sidebar">
      <div className="AdminUserMaster-sidebar-header">
        <img
          src={MahavirLogo}
          alt="Mahavir Hospitals Logo"
          className="AdminUserMaster-sidebar-logo"
        />
      </div>
      <nav className="AdminUserMaster-sidebar-nav">
        <ul className="AdminUserMaster-nav-list">
          {menuItems.map((item) => (
            <li className="AdminUserMaster-nav-item" key={item.key}>
              {item.submenu ? (
                <>
                  <div
                    className={`AdminUserMaster-nav-link AdminUserMaster-submenu-toggle ${activeSubmenu === item.key ? 'AdminUserMaster-active' : ''} ${activeItem === item.key ? 'AdminUserMaster-active' : ''}`}
                    onClick={() => handleSubmenu(item.key)}
                  >
                    <i className={item.icon}></i>
                    <span className="AdminUserMaster-nav-label">{item.label}</span>
                    <i className={`AdminUserMaster-arrow ${activeSubmenu === item.key ? 'AdminUserMaster-arrow-down' : 'AdminUserMaster-arrow-right'}`}></i>
                  </div>
                  {activeSubmenu === item.key && (
                    <ul className="AdminUserMaster-submenu">
                      {item.submenu.map((sub, idx) => (
                        <li key={idx}>
                          <a
                            href={sub.path}
                            className="AdminUserMaster-submenu-link"
                            onClick={(e) => {
                              e.preventDefault();
                              handleSubmenuClick(sub.path);
                            }}
                          >
                            {sub.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <a
                  href={item.path}
                  className={`AdminUserMaster-nav-link ${activeItem === item.key ? 'AdminUserMaster-active' : ''}`}
                  onClick={e => {
                    e.preventDefault();
                    handleMenuClick(item.key, item.path);
                  }}
                >
                  <i className={item.icon}></i>
                  <span className="AdminUserMaster-nav-label">{item.label}</span>
                </a>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;