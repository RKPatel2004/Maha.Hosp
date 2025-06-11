import React, { useEffect, useState } from "react";
import AdminSideBar from "../AdminSideBar/sidebar";
import "./feedback.css";

// Helper to import all feedback emoji images
function importAll(r) {
  let images = {};
  r.keys().forEach((item) => {
    images[item.replace("./", "")] = r(item);
  });
  return images;
}

// Import all images from assets/feedbacks
const emojiImages = importAll(
  require.context("../../../assets/feedbacks", false, /\.(png|jpe?g|svg)$/)
);

const FEEDBACK_QUESTION_API = "http://localhost:5000/MahavirHospital/api/feedback-question";
const FEEDBACK_ANSWER_OPTION_API = "http://localhost:5000/MahavirHospital/api/feedback-answer-option";
const FEEDBACK_FORM_API = "http://localhost:5000/MahavirHospital/api/feedback-form";
const FEEDBACK_DETAIL_API = "http://localhost:5000/MahavirHospital/api/feedback-detail";

// Desired emoji order
const EMOJI_ORDER = ["POOR", "DISSATISFIED", "FAIR", "GOOD", "EXCELLENT"];

const Feedback = () => {
  const [questions, setQuestions] = useState([]);
  const [answerOptions, setAnswerOptions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showAdditionalFeedback, setShowAdditionalFeedback] = useState(false);
  const [additionalFeedback, setAdditionalFeedback] = useState({
    complaints: "",
    suggestions: "",
    appreciation: "",
    correctiveActions: ""
  });

  useEffect(() => {
    window.scrollTo(0,0);
  });

  useEffect(() => {
    fetch(FEEDBACK_QUESTION_API)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setQuestions(data.data);
      });

    fetch(FEEDBACK_ANSWER_OPTION_API)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setAnswerOptions(data.data);
      });
  }, []);

  // Function to store feedback details in localStorage
  const storeFeedbackDetails = (questionId, answerOptionId) => {
    try {
      const existingFeedback = JSON.parse(localStorage.getItem('feedback_details') || '[]');
      const existingIndex = existingFeedback.findIndex(item => item.QuestionID === questionId);

      if (existingIndex !== -1) {
        existingFeedback[existingIndex].AnswerOptionID = answerOptionId;
      } else {
        existingFeedback.push({
          QuestionID: questionId,
          AnswerOptionID: answerOptionId
        });
      }
      localStorage.setItem('feedback_details', JSON.stringify(existingFeedback));
    } catch (error) {
      console.error('Error storing feedback details:', error);
    }
  };

  // Function to remove skipped question from localStorage
  const removeSkippedQuestion = (questionId) => {
    try {
      const existingFeedback = JSON.parse(localStorage.getItem('feedback_details') || '[]');
      const filteredFeedback = existingFeedback.filter(item => item.QuestionID !== questionId);
      localStorage.setItem('feedback_details', JSON.stringify(filteredFeedback));
    } catch (error) {
      console.error('Error removing skipped question:', error);
    }
  };

  if (questions.length === 0) {
    return (
      <div className="feedback-container">
        <div className="feedback-sidebar">
          <AdminSideBar />
        </div>
        <div className="feedback-content">
          <div className="feedback-main">
            <div className="feedback-loader">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  const question = questions[current];
  let options = answerOptions.filter(
    (opt) => opt.AnswerTypeID === question.AnswerTypeID
  );
  options = EMOJI_ORDER.map(order =>
    options.find(opt => opt.AnswerOption.toUpperCase() === order)
  ).filter(Boolean);

  const handleSelect = (optionIdx) => {
    const selectedOption = options[optionIdx];
    setSelectedAnswers({
      ...selectedAnswers,
      [question._id]: optionIdx,
    });
    storeFeedbackDetails(question._id, selectedOption._id);
  };

  const handleNext = () => {
    if (selectedAnswers[question._id] === undefined) {
      removeSkippedQuestion(question._id);
    }
    if (current === questions.length - 1) {
      setShowAdditionalFeedback(true);
    } else {
      setCurrent(current + 1);
    }
  };

  const handleSkip = () => {
    setSelectedAnswers({
      ...selectedAnswers,
      [question._id]: null,
    });
    removeSkippedQuestion(question._id);
    if (current === questions.length - 1) {
      setShowAdditionalFeedback(true);
    } else {
      setCurrent(current + 1);
    }
  };

  const handleAdditionalFeedbackChange = (field, value) => {
    setAdditionalFeedback({
      ...additionalFeedback,
      [field]: value
    });
  };

  // ------------ THE MAIN LOGIC FOR YOUR FLOW ---------------
  const handleSubmitFeedback = async () => {
    try {
      // 1. Submit the additional feedback form
      const feedbackFormPayload = {
        Complains: additionalFeedback.complaints,
        Suggestions: additionalFeedback.suggestions,
        Appreciation: additionalFeedback.appreciation,
        CorrectiveActions: additionalFeedback.correctiveActions
      };
      const formRes = await fetch(FEEDBACK_FORM_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(feedbackFormPayload)
      });
      const formData = await formRes.json();

      if (formData.success && formData._id) {
        // 2. Store FeedbackID in localStorage's feedback_details
        let feedbackDetails = JSON.parse(localStorage.getItem("feedback_details") || "[]");
        feedbackDetails = feedbackDetails.map(item => ({
          ...item,
          FeedbackID: formData._id
        }));
        localStorage.setItem("feedback_details", JSON.stringify(feedbackDetails));

        // 3. For each detail, send POST to feedback-detail
        for (const detail of feedbackDetails) {
          const detailPayload = {
            FeedbackID: detail.FeedbackID,
            QuestionID: detail.QuestionID,
            AnswerOptionID: detail.AnswerOptionID
          };
          await fetch(FEEDBACK_DETAIL_API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(detailPayload)
          });
        }

        // 4. Success message
        alert("Feedback submitted successfully!");
        // Optionally clear localStorage and/or redirect
        localStorage.removeItem("feedback_details");
        // window.location.reload(); // Or redirect to a thank you page
      } else {
        alert("Error submitting feedback form. Please try again.");
      }
    } catch (err) {
      alert("An error occurred while submitting feedback.");
      console.error(err);
    }
  };
  // ----------------------------------------------------------

  const progressText = `Question ${current + 1} Of ${questions.length}`;

  // Show Additional Feedback Form
  if (showAdditionalFeedback) {
    return (
      <div className="feedback-container">
        <div className="feedback-sidebar">
          <AdminSideBar />
        </div>
        <div className="feedback-content">
          <div className="feedback-header">
            <div className="feedback-breadcrumb">
              <span className="breadcrumb-home">🏠</span>
              <span className="breadcrumb-arrow">›</span>
              <span className="breadcrumb-current">Feedback</span>
            </div>
            <div className="stethoscope-bg"></div>
          </div>
          <div className="feedback-main">
            <div className="additional-feedback-card">
              <h2 className="additional-feedback-title">Additional Feedback</h2>
              <div className="feedback-form-group">
                <label className="feedback-form-label">Complains:</label>
                <textarea
                  className="feedback-form-textarea"
                  value={additionalFeedback.complaints}
                  onChange={(e) => handleAdditionalFeedbackChange('complaints', e.target.value)}
                  placeholder="Enter your complaints here..."
                  rows="4"
                />
              </div>
              <div className="feedback-form-group">
                <label className="feedback-form-label">Suggestions:</label>
                <textarea
                  className="feedback-form-textarea"
                  value={additionalFeedback.suggestions}
                  onChange={(e) => handleAdditionalFeedbackChange('suggestions', e.target.value)}
                  placeholder="Enter your suggestions here..."
                  rows="4"
                />
              </div>
              <div className="feedback-form-group">
                <label className="feedback-form-label">Appreciation:</label>
                <textarea
                  className="feedback-form-textarea"
                  value={additionalFeedback.appreciation}
                  onChange={(e) => handleAdditionalFeedbackChange('appreciation', e.target.value)}
                  placeholder="Enter your appreciation here..."
                  rows="4"
                />
              </div>
              <div className="feedback-form-group">
                <label className="feedback-form-label">CorrectiveActions:</label>
                <textarea
                  className="feedback-form-textarea"
                  value={additionalFeedback.correctiveActions}
                  onChange={(e) => handleAdditionalFeedbackChange('correctiveActions', e.target.value)}
                  placeholder="Enter corrective actions here..."
                  rows="4"
                />
              </div>
              <div className="feedback-submit-container">
                <button
                  className="feedback-submit-btn"
                  onClick={handleSubmitFeedback}
                >
                  Submit Feedback
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="feedback-container">
      <div className="feedback-sidebar">
        <AdminSideBar />
      </div>
      <div className="feedback-content">
        <div className="feedback-header">
          <div className="feedback-breadcrumb">
            <span className="breadcrumb-home">🏠</span>
            <span className="breadcrumb-arrow">›</span>
            <span className="breadcrumb-current">Feedback</span>
          </div>
          <div className="stethoscope-bg"></div>
        </div>
        <div className="feedback-main">
          <div className="feedback-card">
            <div className="feedback-progress">{progressText}</div>
            <div className="feedback-group-badge">{question.GroupName}</div>
            <div className="feedback-question">{question.Qusetion}</div>
            <div className="feedback-subtext">How would you rate this?</div>
            <div className="feedback-options-container">
              {options.map((opt, idx) => (
                <div
                  key={opt._id}
                  className={`feedback-option ${
                    selectedAnswers[question._id] === idx
                      ? "feedback-option-selected"
                      : ""
                  }`}
                  onClick={() => handleSelect(idx)}
                >
                  <div className="feedback-emoji-container">
                    <img
                      src={emojiImages[opt.ImagePath] ? emojiImages[opt.ImagePath] : ""}
                      alt={opt.AnswerOption}
                      className="feedback-emoji"
                    />
                  </div>
                  <div
                    className="feedback-option-text"
                    style={{
                      color:
                        opt.AnswerOption.toUpperCase() === "POOR" ||
                        opt.AnswerOption.toUpperCase() === "DISSATISFIED"
                          ? "#E74C3C"
                          : opt.AnswerOption.toUpperCase() === "FAIR"
                          ? "#F39C12"
                          : opt.AnswerOption.toUpperCase() === "GOOD"
                          ? "#17A2B8"
                          : "#28A745",
                    }}
                  >
                    {opt.AnswerOption}
                  </div>
                </div>
              ))}
            </div>
            <div className="feedback-actions">
              <button
                className="feedback-btn feedback-next"
                onClick={handleNext}
              >
                {current === questions.length - 1 ? "Continue" : "Next"}
              </button>
              <button
                className="feedback-btn feedback-skip"
                onClick={handleSkip}
              >
                Skip this Question
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
