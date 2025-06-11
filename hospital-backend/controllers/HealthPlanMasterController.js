const HealthPlanMaster = require("../models/HealthPlanMaster");
const HospitalMaster = require("../models/HospitalMaster");
const HealthPlanTypeMaster = require("../models/HealthPlanTypeMaster");


const getAllHealthPlans = async (req, res) => {
  try {
    // Find all health plans and populate the reference fields
    const healthPlans = await HealthPlanMaster.find({})
      .populate({
        path: "HospitalID",
        model: "HospitalMaster"
      })
      .populate({
        path: "HealthPlanTypeID",
        model: "HealthPlanTypeMaster"
      });

    if (healthPlans.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No health plans found"
      });
    }

    res.status(200).json({
      success: true,
      count: healthPlans.length,
      data: healthPlans
    });
  } catch (error) {
    console.error("Error fetching health plans:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

module.exports = { getAllHealthPlans };