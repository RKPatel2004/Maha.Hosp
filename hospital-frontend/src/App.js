// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import Navbar from './components/header_footer/navbar';
// import Footer from './components/header_footer/footer';
// import Home from './components/home/home';
// import PrivatePolicy from './components/static_pages/privatepolicy';
// import TermsCondition from './components/static_pages/termscondition';
// import VisitorPolicy from './components/static_pages/visitorpolicy';
// import TPAAffiliation from './components/TPAAffiliation/TPAAffiliation';
// import HealthPlans from './components/health_plans/healthplans';
// import Bulletin from './components/bulletin/bulletin';
// import AboutUs from './components/AboutUs/aboutus'; 
// import ContactUs from './components/ContactUs/contactus';
// import Career from './components/Career/career';
// import CareerForm from './components/Career/careerform';
// import Sidebar from './components/Admin/AdminSideBar/sidebar';
// import Login from './components/authentication/login'; 
// import Feedback from './components/Admin/Feedback/feedback';
// import Signup from './components/authentication/signup';
// import ForgotPassword from './components/authentication/forgotpassword';
// import EditProfile from './components/Admin/EditProfile/editprofile';
// import Dashboard from './components/AdminUserMaster/Dashboard/dashboard';
// import ViewRegisteredUsers from './components/AdminUserMaster/Dashboard/ViewRegisteredUsers';
// import ViewRegisteredDoctors from './components/AdminUserMaster/Dashboard/ViewRegisteredDoctors';
// import DoctorRegistration from './components/AdminUserMaster/DoctorRegistration/DoctorRegistration';
// import ViewDoctors from './components/AdminUserMaster/DoctorRegistration/ViewDoctors';

// const ProtectedRoute = ({ children }) => {
//   const isAuthenticated = true; 
//   if (!isAuthenticated) {
//     return <Navigate to="/login" />;
//   }
//   return children;
// };

// const LogoutComponent = () => {
//   // Handle logout logic here
//   React.useEffect(() => {
//     // Clear any authentication tokens/data
//     localStorage.removeItem('authToken');
//     localStorage.removeItem('userInfo');
//     sessionStorage.removeItem('adminToken');
//     sessionStorage.removeItem('authToken');
//     // Redirect to login or home
//     window.location.href = '/login';
//   }, []);

//   return (
//     <div>
//       <h1>Logging out...</h1>
//       <p>Please wait while we log you out.</p>
//     </div>
//   );
// };

// function App() {
//   return (
//     <Router>
//       <div className="app-container">
//         <Routes>
//           <Route path="/" element={<Navigate to="/home" />} />
//           <Route
//             path="/home"
//             element={
//               <ProtectedRoute>
//                 <Home />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/privacy-policy"
//             element={
//               <ProtectedRoute>
//                 <PrivatePolicy />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/terms-condition"
//             element={
//               <ProtectedRoute>
//                 <TermsCondition />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/visitor-policy"
//             element={
//               <ProtectedRoute>
//                 <VisitorPolicy />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/dashboard"
//             element={
//               <ProtectedRoute>
//                 <Navbar />
//                 <main style={{ minHeight: "70vh" }}>
//                   <h1 style={{ padding: "2rem", textAlign: "center" }}>Dashboard Content</h1>
//                 </main>
//                 <Footer />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/tpa-affiliation"
//             element={
//               <ProtectedRoute>
//                 <TPAAffiliation />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/health-plans"
//             element={
//               <ProtectedRoute>
//                 <Navbar />
//                 <main style={{ minHeight: "70vh" }}>
//                   <HealthPlans />
//                 </main>
//                 {/* <Footer /> */}
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/bulletin"
//             element={
//               <ProtectedRoute>
//                 <Navbar />
//                 <main style={{ minHeight: "70vh" }}>
//                   <Bulletin />
//                 </main>
//                 {/* <Footer /> */}
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/about-us"
//             element={
//               <ProtectedRoute>
//                 <AboutUs />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/contact-us"
//             element={
//               <ProtectedRoute>
//                 <ContactUs />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/career"
//             element={
//               <ProtectedRoute>
//                 <Career />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/career-form"
//             element={
//               <ProtectedRoute>
//                 <CareerForm />
//               </ProtectedRoute>
//             }
//           />

//           {/* All Admin Routes - Same Component, Different URLs */}
//           <Route
//             path="/admin"
//             element={
//               <ProtectedRoute>
//                 <Navigate to="/admin/dashboard" />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/admin/dashboard"
//             element={
//               <ProtectedRoute>
//                 <Sidebar />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/admin/edit-profile"
//             element={
//               <ProtectedRoute>
//                 <EditProfile />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/admin/feedback"
//             element={
//               <ProtectedRoute>
//                 <Feedback />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/admin/map-relations"
//             element={
//               <ProtectedRoute>
//                 <Sidebar />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/admin/report"
//             element={
//               <ProtectedRoute>
//                 <Sidebar />
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/signup"
//             element={
//               <ProtectedRoute>
//                 <Signup />
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/forgot-password"
//             element={
//               <ProtectedRoute>
//                 <ForgotPassword />
//               </ProtectedRoute>
//             }
//           />

//           {/* AdminUserMaster routes */}
//           <Route
//             path="/admin-user-master/dashboard"
//             element={
//               <ProtectedRoute>
//                 <Dashboard />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/ViewRegisteredUsers"
//             element={
//               <ProtectedRoute>
//                 <ViewRegisteredUsers />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/ViewRegisteredDoctors"
//             element={
//               <ProtectedRoute>
//                 <ViewRegisteredDoctors />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/doctor-registration"
//             element={
//               <ProtectedRoute>
//                 <DoctorRegistration />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/admin-user-master/doctor-registration"
//             element={
//               <ProtectedRoute>
//                 <DoctorRegistration />
//               </ProtectedRoute>
//             }
//           />
//           {/* Add separate route for ViewDoctors if you want direct access */}
//           <Route
//             path="/admin-user-master/view-doctors"
//             element={
//               <ProtectedRoute>
//                 <ViewDoctors />
//               </ProtectedRoute>
//             }
//           />

//           {/* Login and Logout Routes */}
//           <Route
//             path="/login"
//             element={<Login />}
//           />
//           <Route
//             path="/logout"
//             element={<LogoutComponent />}
//           />

//           {/* Catch-all route - keep this at the end */}
//           <Route path="*" element={<Navigate to="/home" />} />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;









import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './components/header_footer/navbar';
import Footer from './components/header_footer/footer';
import Home from './components/home/home';
import PrivatePolicy from './components/static_pages/privatepolicy';
import TermsCondition from './components/static_pages/termscondition';
import VisitorPolicy from './components/static_pages/visitorpolicy';
import TPAAffiliation from './components/TPAAffiliation/TPAAffiliation';
import HealthPlans from './components/health_plans/healthplans';
import Bulletin from './components/bulletin/bulletin';
import AboutUs from './components/AboutUs/aboutus'; 
import ContactUs from './components/ContactUs/contactus';
import Career from './components/Career/career';
import CareerForm from './components/Career/careerform';
import Sidebar from './components/Admin/AdminSideBar/sidebar';
import Login from './components/authentication/login'; 
import Feedback from './components/Admin/Feedback/feedback';
import Signup from './components/authentication/signup';
import ForgotPassword from './components/authentication/forgotpassword';
import EditProfile from './components/Admin/EditProfile/editprofile';
import Dashboard from './components/AdminUserMaster/Dashboard/dashboard';
import ViewRegisteredUsers from './components/AdminUserMaster/Dashboard/ViewRegisteredUsers';
import ViewRegisteredDoctors from './components/AdminUserMaster/Dashboard/ViewRegisteredDoctors';
import DoctorRegistration from './components/AdminUserMaster/DoctorRegistration/DoctorRegistration';
import ViewDoctors from './components/AdminUserMaster/DoctorRegistration/ViewDoctors';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = true; 
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return children;
};

const LogoutComponent = () => {
  const [logoutStatus, setLogoutStatus] = React.useState('logging_out');
  const [message, setMessage] = React.useState('Logging out...');

  React.useEffect(() => {
    const performLogout = async () => {
      try {
        // Get token from localStorage or sessionStorage
        const authToken = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        const adminToken = sessionStorage.getItem('adminToken');
        
        // Use the token that exists
        const token = authToken || adminToken;
        
        if (token) {
          // Make API call to backend logout endpoint
          const response = await axios.post(
            'http://localhost:5000/MahavirHospital/api/logout',
            {}, // Empty body
            {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
          );
          
          console.log('Logout response:', response.data);
          setMessage('Logout successful. Redirecting...');
        } else {
          console.log('No token found, proceeding with local cleanup');
          setMessage('No active session found. Redirecting...');
        }
        
        // Clear all authentication data from storage
        localStorage.removeItem('authToken');
        localStorage.removeItem('userInfo');
        sessionStorage.removeItem('adminToken');
        sessionStorage.removeItem('authToken');
        
        setLogoutStatus('success');
        
        // Redirect after a short delay
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
        
      } catch (error) {
        console.error('Logout error:', error);
        
        // Even if API call fails, clear local storage and redirect
        localStorage.removeItem('authToken');
        localStorage.removeItem('userInfo');
        sessionStorage.removeItem('adminToken');
        sessionStorage.removeItem('authToken');
        
        setMessage('Logout completed. Redirecting...');
        setLogoutStatus('success');
        
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      }
    };

    performLogout();
  }, []);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      flexDirection: 'column',
      textAlign: 'center'
    }}>
      <h1>{logoutStatus === 'logging_out' ? 'Logging out...' : 'Logout Complete'}</h1>
      <p>{message}</p>
      {logoutStatus === 'logging_out' && (
        <div style={{ marginTop: '20px' }}>
          <div style={{
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #3498db',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            animation: 'spin 2s linear infinite',
            margin: '0 auto'
          }}></div>
        </div>
      )}
    </div>
  );
};

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/privacy-policy"
            element={
              <ProtectedRoute>
                <PrivatePolicy />
              </ProtectedRoute>
            }
          />
          <Route
            path="/terms-condition"
            element={
              <ProtectedRoute>
                <TermsCondition />
              </ProtectedRoute>
            }
          />
          <Route
            path="/visitor-policy"
            element={
              <ProtectedRoute>
                <VisitorPolicy />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Navbar />
                <main style={{ minHeight: "70vh" }}>
                  <h1 style={{ padding: "2rem", textAlign: "center" }}>Dashboard Content</h1>
                </main>
                <Footer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tpa-affiliation"
            element={
              <ProtectedRoute>
                <TPAAffiliation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/health-plans"
            element={
              <ProtectedRoute>
                <Navbar />
                <main style={{ minHeight: "70vh" }}>
                  <HealthPlans />
                </main>
                {/* <Footer /> */}
              </ProtectedRoute>
            }
          />
          <Route
            path="/bulletin"
            element={
              <ProtectedRoute>
                <Navbar />
                <main style={{ minHeight: "70vh" }}>
                  <Bulletin />
                </main>
                {/* <Footer /> */}
              </ProtectedRoute>
            }
          />
          <Route
            path="/about-us"
            element={
              <ProtectedRoute>
                <AboutUs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/contact-us"
            element={
              <ProtectedRoute>
                <ContactUs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/career"
            element={
              <ProtectedRoute>
                <Career />
              </ProtectedRoute>
            }
          />
          <Route
            path="/career-form"
            element={
              <ProtectedRoute>
                <CareerForm />
              </ProtectedRoute>
            }
          />

          {/* All Admin Routes - Same Component, Different URLs */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Navigate to="/admin/dashboard" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <Sidebar />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/edit-profile"
            element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/feedback"
            element={
              <ProtectedRoute>
                <Feedback />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/map-relations"
            element={
              <ProtectedRoute>
                <Sidebar />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/report"
            element={
              <ProtectedRoute>
                <Sidebar />
              </ProtectedRoute>
            }
          />

          <Route
            path="/signup"
            element={
              <ProtectedRoute>
                <Signup />
              </ProtectedRoute>
            }
          />

          <Route
            path="/forgot-password"
            element={
              <ProtectedRoute>
                <ForgotPassword />
              </ProtectedRoute>
            }
          />

          {/* AdminUserMaster routes */}
          <Route
            path="/admin-user-master/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ViewRegisteredUsers"
            element={
              <ProtectedRoute>
                <ViewRegisteredUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ViewRegisteredDoctors"
            element={
              <ProtectedRoute>
                <ViewRegisteredDoctors />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor-registration"
            element={
              <ProtectedRoute>
                <DoctorRegistration />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-user-master/doctor-registration"
            element={
              <ProtectedRoute>
                <DoctorRegistration />
              </ProtectedRoute>
            }
          />
          {/* Add separate route for ViewDoctors if you want direct access */}
          <Route
            path="/admin-user-master/view-doctors"
            element={
              <ProtectedRoute>
                <ViewDoctors />
              </ProtectedRoute>
            }
          />

          {/* Login and Logout Routes */}
          <Route
            path="/login"
            element={<Login />}
          />
          <Route
            path="/logout"
            element={<LogoutComponent />}
          />

          {/* Catch-all route - keep this at the end */}
          <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;