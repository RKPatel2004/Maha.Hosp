import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../header_footer/navbar";
import Footer from "../header_footer/footer";
import "./career.css";

const Career = () => {
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0,0);
  });
  useEffect(() => {
    axios
      .get("http://localhost:5000/MahavirHospital/api/career")
      .then((res) => {
        setCareers(res.data.Careers || []);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  }, []);

  return (
    <>
      <div className="career-header-bg">
        <div className="navbar-wrapper">
          <Navbar />
        </div>
        <div className="career-header">
          <h1>Career with Us</h1>
          <div className="career-breadcrumb">
            <a href="/">Home</a> / Career
          </div>
        </div>
      </div>

      <div className="career-main-content">
        <div className="career-cta">
          <span className="career-cta-small">— JUST A CALL AWAY</span>
          <h2>
            Be <span className="career-bold">A Part Of</span> Our Team!
          </h2>
        </div>

        {loading ? (
          <div className="career-loading">Loading...</div>
        ) : (
          careers.map((dept, idx) => (
            <div className="career-department-section" key={idx}>
              <div className="career-dept-title">
                <span>—</span> {dept.DepartmentName.toUpperCase()}
              </div>
              <table className="career-table">
                <thead>
                  <tr>
                    <th>Sr. No.</th>
                    <th>Designation</th>
                    <th>Closing Date</th>
                    <th>Apply</th>
                  </tr>
                </thead>
                <tbody>
                  {dept.Openings.map((opening, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{opening.Designation}</td>
                      <td>{opening.EndDate}</td>
                      <td>
                        <button className="career-apply-btn"
                          onClick={() => {
                            const data = {
                              CareerOpeningID: opening.CareerOpeningID,
                              DepartmentID: opening.DepartmentID,
                              DepartmentName: dept.DepartmentName,
                              HospitalID: opening.HospitalID,
                              HospitalName: opening.HospitalName,
                              DesignationID: opening.DesignationID,
                              Designation: opening.Designation,
                              EndDate: opening.EndDate,
                            };
                            localStorage.setItem("career-data", JSON.stringify(data));
                            navigate("/career-form");
                          }}
                        >
                          Apply
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))
        )}
      </div>
      <Footer />
    </>
  );
};

export default Career;