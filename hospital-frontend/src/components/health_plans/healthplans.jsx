// import React, { useEffect, useState } from 'react';
// import './healthplans.css';
// import { FaFilePdf } from 'react-icons/fa';
// import Navbar from '../header_footer/navbar';
// import Footer from '../header_footer/footer';
// const HealthPlans = () => {
//   const [plans, setPlans] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);

//   useEffect(() => {
//     fetch('http://localhost:5000/api/health-plans')
//       .then((res) => res.json())
//       .then((result) => {
//         if (result.success && Array.isArray(result.data)) {
//           setPlans(result.data);
//         }
//         setLoading(false);
//       })
//       .catch(() => setLoading(false));
//   }, []);

//   return (
//     <div className="healthplans-page">
//       {/* Navbar at the top */}
//       <div className="navbar-wrapper">
//         <Navbar />
//       </div>
//       {/* Main Content */}
//       <div className="healthplans-header">
//         <h1>Health & Wellness Plans</h1>
//         <div className="breadcrumb">
//           <a href="/">Home</a> / Health Plans
//         </div>
//       </div>
//       <div className="healthplans-grid">
//         {loading ? (
//           <div className="loading">Loading...</div>
//         ) : (
//           plans.map((plan, idx) => (
//             <div className="plan-card" key={plan._id || idx}>
//               <div className="plan-image-container">
//                 <img
//                   src={require(`../../assets/health_plans/${plan.CoverImagePath}`)}
//                   alt={plan.HealthPlanName}
//                   className="plan-image"
//                 />
//                 {/* <a
//                   href={require(`../../assets/health_plans_pdfs/${plan.FilePath}`)}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="pdf-icon-link"
//                   title="View PDF"
//                 >
//                   <FaFilePdf className="pdf-icon" />
//                 </a> */}
//               </div>
//               <div className="plan-content">
//                 <div className="plan-title">{plan.HealthPlanName}</div>
//                 <div className="plan-type">{plan.HealthPlanTypeID?.HealthPlanType}</div>
//                 <div className="plan-hospital">{plan.HospitalID?.HospitalName}</div>
//                 <div className="plan-price">
//                   Price - ₹
//                   {plan.price?.$numberDecimal
//                     ? Number(plan.price.$numberDecimal).toLocaleString()
//                     : plan.price}
//                 </div>
//               </div>
//               <a
//                   href={require(`../../assets/health_plans_pdfs/${plan.FilePath}`)}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="pdf-icon-link"
//                   title="View PDF"
//                 >
//                   <FaFilePdf className="pdf-icon" />
//                 </a>
//             </div>
//           ))
//         )}
//       </div>
//       {/* Footer at the bottom */}
//       <Footer />
//     </div>
//   );
// };

// export default HealthPlans;









import React, { useEffect, useState } from 'react';
import './healthplans.css';
import { FaFilePdf } from 'react-icons/fa';
import Navbar from '../header_footer/navbar';
import Footer from '../header_footer/footer';

const HealthPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    fetch('http://localhost:5000/api/health-plans')
      .then((res) => res.json())
      .then((result) => {
        if (result.success && Array.isArray(result.data)) {
          setPlans(result.data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const getImageUrl = (coverImagePath) => {
    if (coverImagePath) {
      // Serve images directly from backend
      return `http://localhost:5000/${coverImagePath}`;
    }
    // Fallback to default image if no cover image
    return require('../../assets/health_plans/default-plan.jpg'); // Make sure you have a default image
  };

  // Helper function to get PDF URL
  const getPdfUrl = (filePath) => {
    if (filePath) {
      return `http://localhost:5000/${filePath}`;
    }
    return null;
  };

  return (
    <div className="healthplans-page">
      {/* Navbar at the top */}
      <div className="navbar-wrapper">
        <Navbar />
      </div>
      {/* Main Content */}
      <div className="healthplans-header">
        <h1>Health & Wellness Plans</h1>
        <div className="breadcrumb">
          <a href="/">Home</a> / Health Plans
        </div>
      </div>
      <div className="healthplans-grid">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          plans.map((plan, idx) => (
            <div className="plan-card" key={plan._id || idx}>
              <div className="plan-image-container">
                <img
                  src={getImageUrl(plan.CoverImagePath)}
                  alt={plan.HealthPlanName}
                  className="plan-image"
                  onError={(e) => {
                    // Fallback to default image if image fails to load
                    e.target.src = require('../../assets/health_plans/default-plan.jpg');
                  }}
                />
              </div>
              <div className="plan-content">
                <div className="plan-title">{plan.HealthPlanName}</div>
                <div className="plan-type">{plan.HealthPlanTypeID?.HealthPlanType}</div>
                <div className="plan-hospital">{plan.HospitalID?.HospitalName}</div>
                <div className="plan-price">
                  Price - ₹
                  {plan.price?.$numberDecimal
                    ? Number(plan.price.$numberDecimal).toLocaleString()
                    : plan.price}
                </div>
              </div>
              {getPdfUrl(plan.FilePath) && (
                <a
                  href={getPdfUrl(plan.FilePath)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pdf-icon-link"
                  title="View PDF"
                >
                  <FaFilePdf className="pdf-icon" />
                </a>
              )}
            </div>
          ))
        )}
      </div>
      {/* Footer at the bottom */}
      <Footer />
    </div>
  );
};

export default HealthPlans;