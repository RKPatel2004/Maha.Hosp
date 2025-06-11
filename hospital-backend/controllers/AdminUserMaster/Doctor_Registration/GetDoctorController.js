const UserMaster = require("../../../models/UserMaster");

// Get doctor by mobile number
const getDoctorByMobile = async (req, res) => {
  try {
    const { MobileNo } = req.body || {};

    // Validate mobile number
    if (!MobileNo) {
      return res.status(400).json({
        success: false,
        message: "Mobile number is required"
      });
    }

    // Find doctor by mobile number
    const doctor = await UserMaster.findOne({ MobileNo: MobileNo, UserTypeID: 1 });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found with this mobile number"
      });
    }

    // Return doctor information (excluding sensitive data like password)
    const doctorInfo = {
        FilePath: doctor.FilePath,
        UserName: doctor.UserName,
        UserPassword: doctor.UserPassword,
        Pincode: doctor.Pincode,
        EmailID: doctor.EmailID,
        Address: doctor.Address,
    };

    res.status(200).json({
      success: true,
      message: "Doctor retrieved successfully",
      data: doctorInfo
    });

  } catch (error) {
    console.error("Error retrieving doctor:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

module.exports = {
  getDoctorByMobile
};