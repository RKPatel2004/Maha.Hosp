// const express = require("express");
// const dotenv = require("dotenv");
// const cors = require("cors");
// const path = require("path");
// const connectDB = require("./config/db");

// const privatePolicyRoutes = require("./routes/privatePolicyRoute");
// const healthPlanRoutes = require("./routes/getHealthPlanMasterRoute");
// const HospitalMasterRoute = require("./routes/HospitalMasterRoute");
// const TermsConditionRoute = require("./routes/TermsConditionRoute");
// const VisitorPolicyRoute = require("./routes/VisitorPolicy");
// const MissonVisionRoute = require("./routes/MissonVisionRoute");
// const BulletinMasterRoute = require("./routes/BulletinMasterRoute");
// const TPAAffiliationRoute = require("./routes/TPAAffiliationRoute");
// const HospitalHistoryRoute = require("./routes/HospitalHistoryRoute"); 
// const CareerRoute = require('./routes/CareerRoute');
// const CareerFormRoute = require('./routes/CareerFormRoute');
// const ContactRoute = require('./routes/contactRoute');
// const FeedbackQuestionRoute = require('./routes/Feedback/FeedbackQuestionRoute');
// const FeedbackAnswerOptionRoute = require('./routes/Feedback/FeedbackAnswerOptionRoute');
// const FeedbackFormRoute = require("./routes/Feedback/FeedbackFormRoute");
// const FeedbackDetailRoute = require("./routes/Feedback/FeedbackDetailRoute");
// const signupRoute = require("./routes/register/SignupRoute");
// const loginRoute = require("./routes/register/LoginRoute");
// const forgotPasswordRoute = require("./routes/register/ForgotPasswordRoute");
// const UserProfileRoute = require("./routes/register/UserProfileRoute");
// const GetUsersRoute = require("./routes/AdminUserMaster/Dashboard/GetUsersRoute");
// const AdminLoginRoute = require("./routes/register/AdminLoginRoute");
// const DoctorRegistrationRoute = require("./routes/AdminUserMaster/Doctor_Registration/DoctorRegistrationRoute");
// const GetDoctorRoute = require('./routes/AdminUserMaster/Doctor_Registration/GetDoctorRoute');
// const EditDoctorRoute = require('./routes/AdminUserMaster/Doctor_Registration/EditDoctorRoute');
// const CareerOpeningRoute = require('./routes/AdminUserMaster/Career/CareerOpeningRoute');
// const DepartmentRoute = require('./routes/AdminUserMaster/Department/DepartmentRoute');
// const GetAllDepartmentsRoute = require('./routes/AdminUserMaster/Department/GetAllDepartmentsRoute');
// const FeedbackQuestion = require('./routes/AdminUserMaster/Feedback/FeedbackQuestionRoute');
// const HospitalRoute = require('./routes/AdminUserMaster/FrontPages/Hospitals/HospitalRoute');
// const SubmitHealthPlanRoute = require('./routes/AdminUserMaster/FrontPages/HealthPlan/SubmitHealthPlanRoute');
// const HealthPlanRoute = require("./routes/AdminUserMaster/FrontPages/HealthPlan/HealthPlanRoute");
// const AdminBulletinRoute = require('./routes/AdminUserMaster/FrontPages/Bulletin/BulletinRoute');
// const TPAAffiliationsRoute = require('./routes/AdminUserMaster/FrontPages/TPAAffiliations/TPAAffiliationsRoute');
// const MissonVision = require('./routes/AdminUserMaster/FrontPages/MissonVision/MissonVisionRoute');
// const UserRightRoute = require('./routes/AdminUserMaster/FrontPages/UserRights/UserRightRoute');
// const PolicyRoute = require('./routes/AdminUserMaster/FrontPages/Policies/PolicyRoute');

// dotenv.config();

// connectDB();

// const app = express();

// app.use(cors({
//   origin: "http://localhost:3000", 
//   credentials: true,
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   allowedHeaders: ["Content-Type", "Authorization"]
// }));

// app.use(express.json());
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// app.get("/", (req, res) => {
//   res.send("API is running...");
// });

// app.use("/api/private-policy", privatePolicyRoutes);
// app.use("/api/health-plans", healthPlanRoutes);
// app.use("/api/hospitals", HospitalMasterRoute);
// app.use("/api/terms-condition", TermsConditionRoute);
// app.use("/api/visitor-policy", VisitorPolicyRoute);
// app.use("/MahavirHospital/api", MissonVisionRoute);
// app.use("/MahavirHospital/api", BulletinMasterRoute);
// app.use("/MahavirHospital/api", TPAAffiliationRoute);
// app.use("/MahavirHospital/api", HospitalHistoryRoute);
// app.use("/MahavirHospital/api", CareerRoute);
// app.use("/MahavirHospital/api", CareerFormRoute);
// app.use("/MahavirHospital/api", ContactRoute);
// app.use("/MahavirHospital/api", FeedbackQuestionRoute);
// app.use("/MahavirHospital/api", FeedbackAnswerOptionRoute);
// app.use("/MahavirHospital/api", FeedbackFormRoute);
// app.use("/MahavirHospital/api", FeedbackDetailRoute);
// app.use("/MahavirHospital/api/signup", signupRoute);
// app.use("/MahavirHospital/api", loginRoute);
// app.use("/MahavirHospital/api", forgotPasswordRoute);
// app.use("/MahavirHospital/api", UserProfileRoute);
// app.use("/MahavirHospital/api", GetUsersRoute);
// app.use("/MahavirHospital/api", AdminLoginRoute);
// app.use("/MahavirHospital/api", DoctorRegistrationRoute);
// app.use("/MahavirHospital/api", GetDoctorRoute);
// app.use("/MahavirHospital/api", EditDoctorRoute);
// app.use("/MahavirHospital/api", CareerOpeningRoute);
// app.use("/MahavirHospital/api", DepartmentRoute);
// app.use("/MahavirHospital/api", GetAllDepartmentsRoute);
// app.use("/MahavirHospital/api", FeedbackQuestion);
// app.use("/MahavirHospital/api", HospitalRoute);
// app.use("/MahavirHospital/api", SubmitHealthPlanRoute);
// app.use("/MahavirHospital/api", HealthPlanRoute);
// app.use("/MahavirHospital/api", AdminBulletinRoute);
// app.use("/MahavirHospital/api", TPAAffiliationsRoute);
// app.use("/MahavirHospital/api", MissonVision);
// app.use("/MahavirHospital/api", UserRightRoute);
// app.use("/MahavirHospital/api", PolicyRoute);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });









const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

const privatePolicyRoutes = require("./routes/privatePolicyRoute");
const healthPlanRoutes = require("./routes/getHealthPlanMasterRoute");
const HospitalMasterRoute = require("./routes/HospitalMasterRoute");
const TermsConditionRoute = require("./routes/TermsConditionRoute");
const VisitorPolicyRoute = require("./routes/VisitorPolicy");
const MissonVisionRoute = require("./routes/MissonVisionRoute");
const BulletinMasterRoute = require("./routes/BulletinMasterRoute");
const TPAAffiliationRoute = require("./routes/TPAAffiliationRoute");
const HospitalHistoryRoute = require("./routes/HospitalHistoryRoute"); 
const CareerRoute = require('./routes/CareerRoute');
const CareerFormRoute = require('./routes/CareerFormRoute');
const ContactRoute = require('./routes/contactRoute');
const FeedbackQuestionRoute = require('./routes/Feedback/FeedbackQuestionRoute');
const FeedbackAnswerOptionRoute = require('./routes/Feedback/FeedbackAnswerOptionRoute');
const FeedbackFormRoute = require("./routes/Feedback/FeedbackFormRoute");
const FeedbackDetailRoute = require("./routes/Feedback/FeedbackDetailRoute");
const signupRoute = require("./routes/register/SignupRoute");
const loginRoute = require("./routes/register/LoginRoute");
const logoutRoute = require("./routes/register/LogoutRoute"); 
const forgotPasswordRoute = require("./routes/register/ForgotPasswordRoute");
const UserProfileRoute = require("./routes/register/UserProfileRoute");
const GetUsersRoute = require("./routes/AdminUserMaster/Dashboard/GetUsersRoute");
const AdminLoginRoute = require("./routes/register/AdminLoginRoute");
const DoctorRegistrationRoute = require("./routes/AdminUserMaster/Doctor_Registration/DoctorRegistrationRoute");
const GetDoctorRoute = require('./routes/AdminUserMaster/Doctor_Registration/GetDoctorRoute');
const EditDoctorRoute = require('./routes/AdminUserMaster/Doctor_Registration/EditDoctorRoute');
const CareerOpeningRoute = require('./routes/AdminUserMaster/Career/CareerOpeningRoute');
const DepartmentRoute = require('./routes/AdminUserMaster/Department/DepartmentRoute');
const GetAllDepartmentsRoute = require('./routes/AdminUserMaster/Department/GetAllDepartmentsRoute');
const FeedbackQuestion = require('./routes/AdminUserMaster/Feedback/FeedbackQuestionRoute');
const HospitalRoute = require('./routes/AdminUserMaster/FrontPages/Hospitals/HospitalRoute');
const SubmitHealthPlanRoute = require('./routes/AdminUserMaster/FrontPages/HealthPlan/SubmitHealthPlanRoute');
const HealthPlanRoute = require("./routes/AdminUserMaster/FrontPages/HealthPlan/HealthPlanRoute");
const AdminBulletinRoute = require('./routes/AdminUserMaster/FrontPages/Bulletin/BulletinRoute');
const TPAAffiliationsRoute = require('./routes/AdminUserMaster/FrontPages/TPAAffiliations/TPAAffiliationsRoute');
const MissonVision = require('./routes/AdminUserMaster/FrontPages/MissonVision/MissonVisionRoute');
const UserRightRoute = require('./routes/AdminUserMaster/FrontPages/UserRights/UserRightRoute');
const PolicyRoute = require('./routes/AdminUserMaster/FrontPages/Policies/PolicyRoute');

dotenv.config();

connectDB();

const app = express();

app.use(cors({
  origin: "http://localhost:3000", 
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/private-policy", privatePolicyRoutes);
app.use("/api/health-plans", healthPlanRoutes);
app.use("/api/hospitals", HospitalMasterRoute);
app.use("/api/terms-condition", TermsConditionRoute);
app.use("/api/visitor-policy", VisitorPolicyRoute);
app.use("/MahavirHospital/api", MissonVisionRoute);
app.use("/MahavirHospital/api", BulletinMasterRoute);
app.use("/MahavirHospital/api", TPAAffiliationRoute);
app.use("/MahavirHospital/api", HospitalHistoryRoute);
app.use("/MahavirHospital/api", CareerRoute);
app.use("/MahavirHospital/api", CareerFormRoute);
app.use("/MahavirHospital/api", ContactRoute);
app.use("/MahavirHospital/api", FeedbackQuestionRoute);
app.use("/MahavirHospital/api", FeedbackAnswerOptionRoute);
app.use("/MahavirHospital/api", FeedbackFormRoute);
app.use("/MahavirHospital/api", FeedbackDetailRoute);
app.use("/MahavirHospital/api/signup", signupRoute);
app.use("/MahavirHospital/api", loginRoute);
app.use("/MahavirHospital/api", logoutRoute); // Add this line
app.use("/MahavirHospital/api", forgotPasswordRoute);
app.use("/MahavirHospital/api", UserProfileRoute);
app.use("/MahavirHospital/api", GetUsersRoute);
app.use("/MahavirHospital/api", AdminLoginRoute);
app.use("/MahavirHospital/api", DoctorRegistrationRoute);
app.use("/MahavirHospital/api", GetDoctorRoute);
app.use("/MahavirHospital/api", EditDoctorRoute);
app.use("/MahavirHospital/api", CareerOpeningRoute);
app.use("/MahavirHospital/api", DepartmentRoute);
app.use("/MahavirHospital/api", GetAllDepartmentsRoute);
app.use("/MahavirHospital/api", FeedbackQuestion);
app.use("/MahavirHospital/api", HospitalRoute);
app.use("/MahavirHospital/api", SubmitHealthPlanRoute);
app.use("/MahavirHospital/api", HealthPlanRoute);
app.use("/MahavirHospital/api", AdminBulletinRoute);
app.use("/MahavirHospital/api", TPAAffiliationsRoute);
app.use("/MahavirHospital/api", MissonVision);
app.use("/MahavirHospital/api", UserRightRoute);
app.use("/MahavirHospital/api", PolicyRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});