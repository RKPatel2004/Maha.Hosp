import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import Navbar from "../header_footer/navbar";
import Footer from "../header_footer/footer";
import "./careerform.css";
import { FaPlus } from "react-icons/fa";

const Spinner = () => (
  <div className="careerform-spinner-overlay">
    <div className="careerform-spinner">
      <div className="careerform-spinner-dot"></div>
      <div className="careerform-spinner-dot"></div>
      <div className="careerform-spinner-dot"></div>
    </div>
    <div style={{ marginTop: 20, color: "#b71c1c", fontWeight: 600 }}>
      Submitting...
    </div>
  </div>
);

const Popup = ({ message }) => (
  <div className="careerform-popup-overlay">
    <div className="careerform-popup-message">{message}</div>
  </div>
);

const CareerForm = () => {
  const careerData = JSON.parse(localStorage.getItem("career-data")) || {};
  
  // Fetch DepartmentID and DesignationID from localStorage
  const departmentData = JSON.parse(localStorage.getItem("department-data")) || {};
  const designationData = JSON.parse(localStorage.getItem("designation-data")) || {};

  // State for form fields
  const [fullName, setFullName] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [emailID, setEmailID] = useState("");
  const [gender, setGender] = useState("");
  const [qualification, setQualification] = useState("");
  const [totalExperience, setTotalExperience] = useState("");
  const [remarks, setRemarks] = useState("");
  const [resume, setResume] = useState(null);

  // UI feedback states
  const [showSpinner, setShowSpinner] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMsg, setPopupMsg] = useState("");
  const [submitStatus, setSubmitStatus] = useState(null);

  const fileInputRef = useRef();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Email validation for .com emails
  const isValidEmail = (email) => {
    return /^[\w.-]+@[\w.-]+\.(com)$/i.test(email);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !fullName ||
      !mobileNo ||
      !emailID ||
      !gender ||
      !qualification ||
      !totalExperience ||
      !resume
    ) {
      setSubmitStatus("Please fill all required fields and upload your resume.");
      return;
    }
    if (!isValidEmail(emailID)) {
      setSubmitStatus("Email must end with .com");
      return;
    }

    setSubmitStatus(null);
    setShowSpinner(true);

    // Wait for 3 seconds (simulate loading)
    setTimeout(async () => {
      // Prepare form data with IDs from localStorage
      const formData = new FormData();
      formData.append("CareerOpeningID", careerData.CareerOpeningID);
      formData.append("DepartmentID", departmentData.DepartmentID || careerData.DepartmentID);
      formData.append("DesignationID", designationData.DesignationID || careerData.DesignationID);
      formData.append("FullName", fullName);
      formData.append("Gender", gender);
      formData.append("MobileNo", mobileNo);
      formData.append("EmailID", emailID);
      formData.append("Qualification", qualification);
      formData.append("TotalExperience", totalExperience);
      formData.append("Remarks", remarks);
      formData.append("resume", resume);

      try {
        await axios.post(
          "http://localhost:5000/MahavirHospital/api/career-from",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setShowSpinner(false);
        setPopupMsg("Career Form Submitted Successfully.");
        setShowPopup(true);
        localStorage.removeItem("career-data");

        // Reset form
        setFullName("");
        setMobileNo("");
        setEmailID("");
        setGender("");
        setQualification("");
        setTotalExperience("");
        setRemarks("");
        setResume(null);
        if (fileInputRef.current) fileInputRef.current.value = "";

        // Hide popup after 2 seconds
        setTimeout(() => {
          setShowPopup(false);
        }, 2000);
      } catch (error) {
        setShowSpinner(false);
        setSubmitStatus(
          error.response?.data?.error || "Submission failed. Try again."
        );
      }
    }, 3000);
  };

  // Handle file input
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setResume(e.target.files[0]);
    }
  };

  return (
    <>
      <div className="careerform-header-bg">
        <div className="navbar-wrapper">
          <Navbar />
        </div>
        <div className="careerform-header">
          <h1>{careerData.Designation || designationData.DesignationName || "Position"}</h1>
          <div className="careerform-breadcrumb">
            <a href="/">Home</a> / Career
          </div>
        </div>
      </div>

      <div className="careerform-main-content">
        <div className="careerform-cta">
          <span className="careerform-cta-small">— CAREER SUBMISSION</span>
          <h2>{careerData.HospitalName || "Hospital"}</h2>
          <h3>
            {careerData.DepartmentName || departmentData.DepartmentName || "Department"} ({careerData.Designation || designationData.DesignationName || "Position"})
          </h3>
        </div>

        <form
          className="careerform-container"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          <div className="careerform-content-1">
            <input
              type="text"
              className="careerform-name"
              placeholder="Your Name*"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <input
              type="number"
              className="careerform-mobile"
              maxLength="10"
              placeholder="Mobile Number*"
              required
              value={mobileNo}
              onChange={(e) => setMobileNo(e.target.value)}
            />
            <input
              type="email"
              className="careerform-email"
              placeholder="Email Address*"
              required
              value={emailID}
              onChange={(e) => setEmailID(e.target.value)}
            />
            <select
              className="careerform-gender-select"
              required
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">--Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <input
              type="text"
              className="careerform-qualification"
              placeholder="Qualification*"
              required
              value={qualification}
              onChange={(e) => setQualification(e.target.value)}
            />
            <input
              type="text"
              className="careerform-experience"
              placeholder="Total Experience (Years)*"
              required
              value={totalExperience}
              onChange={(e) => setTotalExperience(e.target.value)}
            />
          </div>
          <div className="careerform-content-2">
            <textarea
              className="careerform-remark"
              placeholder="Remark"
              rows="5"
              cols="100"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            ></textarea>
          </div>

          <div className="careerform-file-upload">
            <input
              type="file"
              className="careerform-file-input"
              placeholder="Resume"
              accept="application/pdf"
              required
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          </div>

          <div className="careerform-submit-button">
            <button type="submit" className="careerform-send-message" disabled={showSpinner}>
              {showSpinner ? (
                <span style={{ color: "#fff" }}>Submitting...</span>
              ) : (
                <>
                  Send Message | <FaPlus className="plus-icon" />
                </>
              )}
            </button>
          </div>
          {submitStatus && (
            <div style={{ marginTop: "10px", color: "#b71c1c" }}>
              {submitStatus}
            </div>
          )}
        </form>
        {showSpinner && <Spinner />}
        {showPopup && <Popup message={popupMsg} />}
      </div>
      <Footer />
    </>
  );
};

export default CareerForm;