const HealthPlanMaster = require("../../../../models/HealthPlanMaster");
const HospitalMaster = require("../../../../models/HospitalMaster");
const HealthPlanTypeMaster = require("../../../../models/HealthPlanTypeMaster");
const fs = require('fs');
const path = require('path');

// Helper function to clean field names and values
const cleanFormData = (body) => {
  const cleaned = {};
  for (const [key, value] of Object.entries(body)) {
    const cleanKey = key.trim();
    const cleanValue = typeof value === 'string' ? value.trim() : value;
    cleaned[cleanKey] = cleanValue;
  }
  return cleaned;
};

const submitHealthPlan = async (req, res) => {
  try {
    // Clean the form data
    const cleanedBody = cleanFormData(req.body);
    
    const {
      HospitalName,
      HealthPlanType,
      HealthPlanName,
      Description,
      price
    } = cleanedBody;

    console.log("Cleaned request body:", cleanedBody);

    if (!HospitalName || !HealthPlanType || !HealthPlanName) {
      return res.status(400).json({
        success: false,
        message: "HospitalName, HealthPlanType, and HealthPlanName are required"
      });
    }

    const hospital = await HospitalMaster.findOne({ HospitalName: HospitalName });
    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: "Hospital not found"
      });
    }

    // Find HealthPlanType by name
    const healthPlanType = await HealthPlanTypeMaster.findOne({ HealthPlanType: HealthPlanType });
    if (!healthPlanType) {
      return res.status(404).json({
        success: false,
        message: "Health Plan Type not found"
      });
    }

    // Get file paths from uploaded files
    let coverImagePath = "";
    let filePath = "";
    
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        if (file.fieldname === 'coverImage') {
          coverImagePath = file.path;
        } else if (file.fieldname === 'planFile') {
          filePath = file.path;
        }
      });
    }

    // Generate new ID (you might want to implement auto-increment differently)
    const lastHealthPlan = await HealthPlanMaster.findOne().sort({ _id: -1 });
    const newId = lastHealthPlan ? lastHealthPlan._id + 1 : 1;

    // Create new health plan
    const newHealthPlan = new HealthPlanMaster({
      _id: newId,
      HospitalID: hospital._id,
      HealthPlanTypeID: healthPlanType._id,
      HealthPlanName: HealthPlanName,
      Description: Description || "",
      price: price || 0,
      CoverImagePath: coverImagePath,
      FilePath: filePath,
      IsActive: true
    });

    // Save to database
    const savedHealthPlan = await newHealthPlan.save();

    res.status(201).json({
      success: true,
      message: "Health Plan created successfully",
      data: savedHealthPlan
    });

  } catch (error) {
    console.error("Error creating health plan:", error);
    
    // Clean up uploaded files on error
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        try {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        } catch (err) {
          console.log(`Error cleaning up uploaded file ${file.fieldname}:`, err);
        }
      });
    }
    
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

const editHealthPlan = async (req, res) => {
  try {
    console.log("Edit Health Plan Request Body:", req.body);
    console.log("Edit Health Plan Request Files:", req.files);
    console.log("Edit Health Plan Request Params:", req.params);

    const healthPlanId = req.params.id;
    
    // Clean the form data to remove extra spaces
    const cleanedBody = cleanFormData(req.body);
    console.log("Cleaned request body:", cleanedBody);
    
    const {
      HospitalName,
      HealthPlanType,
      HealthPlanName,
      Description,
      price
    } = cleanedBody;

    // Validate ID
    if (!healthPlanId) {
      return res.status(400).json({
        success: false,
        message: "Health Plan ID is required"
      });
    }

    // Convert to number and validate
    const numericId = parseInt(healthPlanId);
    if (isNaN(numericId)) {
      return res.status(400).json({
        success: false,
        message: "Health Plan ID must be a valid number"
      });
    }

    // Check if health plan exists
    const existingHealthPlan = await HealthPlanMaster.findOne({ _id: numericId });
    if (!existingHealthPlan) {
      return res.status(404).json({
        success: false,
        message: "Health Plan not found"
      });
    }

    // Validate required fields
    if (!HospitalName || !HealthPlanType || !HealthPlanName) {
      return res.status(400).json({
        success: false,
        message: "HospitalName, HealthPlanType, and HealthPlanName are required",
        received: {
          HospitalName: HospitalName || 'missing',
          HealthPlanType: HealthPlanType || 'missing',
          HealthPlanName: HealthPlanName || 'missing'
        }
      });
    }

    // Find Hospital by name
    const hospital = await HospitalMaster.findOne({ HospitalName: HospitalName });
    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: "Hospital not found",
        searchedFor: HospitalName
      });
    }

    // Find HealthPlanType by name
    const healthPlanType = await HealthPlanTypeMaster.findOne({ HealthPlanType: HealthPlanType });
    if (!healthPlanType) {
      return res.status(404).json({
        success: false,
        message: "Health Plan Type not found",
        searchedFor: HealthPlanType
      });
    }

    // Prepare update object
    const updateData = {
      HospitalID: hospital._id,
      HealthPlanTypeID: healthPlanType._id,
      HealthPlanName: HealthPlanName,
      Description: Description || "",
      price: parseFloat(price) || 0
    };

    // Handle file uploads
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        if (file.fieldname === 'coverImage') {
          // Delete old cover image if exists
          if (existingHealthPlan.CoverImagePath && fs.existsSync(existingHealthPlan.CoverImagePath)) {
            try {
              fs.unlinkSync(existingHealthPlan.CoverImagePath);
              console.log("Old cover image deleted successfully");
            } catch (err) {
              console.log("Error deleting old cover image:", err);
            }
          }
          updateData.CoverImagePath = file.path;
        } else if (file.fieldname === 'planFile') {
          // Delete old plan file if exists
          if (existingHealthPlan.FilePath && fs.existsSync(existingHealthPlan.FilePath)) {
            try {
              fs.unlinkSync(existingHealthPlan.FilePath);
              console.log("Old plan file deleted successfully");
            } catch (err) {
              console.log("Error deleting old plan file:", err);
            }
          }
          updateData.FilePath = file.path;
        }
      });
    }

    console.log("Update data:", updateData);

    // Update health plan
    const updatedHealthPlan = await HealthPlanMaster.findOneAndUpdate(
      { _id: numericId },
      updateData,
      { upsert: true, runValidators: true }
    );

    if (!updatedHealthPlan) {
      return res.status(404).json({
        success: false,
        message: "Failed to update health plan"
      });
    }

    res.status(200).json({
      success: true,
      message: "Health Plan updated successfully",
      data: updatedHealthPlan
    });

  } catch (error) {
    console.error("Error updating health plan:", error);
    
    // If there was an error and new files were uploaded, clean them up
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        try {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        } catch (err) {
          console.log(`Error cleaning up uploaded file ${file.fieldname}:`, err);
        }
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

module.exports = {
  submitHealthPlan,
  editHealthPlan
};