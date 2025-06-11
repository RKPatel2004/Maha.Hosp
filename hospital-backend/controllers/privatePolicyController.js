const PrivatePolicy = require("../models/PrivatePolicy");

const getAllPrivatePolicies = async (req, res) => {
  try {
    const privatePolicies = await PrivatePolicy.find().lean();      
    res.status(200).json({
      success: true,
      count: privatePolicies.length,
      data: privatePolicies
    });
  } catch (error) {
    console.error(`Error fetching private policies: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

const getPrivatePolicyById = async (req, res) => {
  try {
    const policyId = parseInt(req.params.id);
    
    if (isNaN(policyId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format"
      });
    }

    const privatePolicy = await PrivatePolicy.findOne({ _id: policyId }).lean();
    
    if (!privatePolicy) {
      return res.status(404).json({
        success: false,
        message: "Private policy not found"
      });
    }

    res.status(200).json({
      success: true,
      data: privatePolicy
    });
  } catch (error) {
    console.error(`Error fetching private policy: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

module.exports = { getAllPrivatePolicies, getPrivatePolicyById };