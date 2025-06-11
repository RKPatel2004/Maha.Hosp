const HospitalHistory = require("../models/HospitalHistory");
const HospitalMaster = require("../models/HospitalMaster");


const getHospitalHistoryByHospitalId = async (req, res) => {
  try {
    const hospitalId = parseInt(req.params.id);
    
    if (isNaN(hospitalId)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid hospital ID"
      });
    }

    const hospital = await HospitalMaster.findOne({ _id: hospitalId });
    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: `Hospital with ID ${hospitalId} not found`
      });
    }

    const hospitalHistory = await HospitalHistory.findOne({ HospitalID: hospitalId });

    if (!hospitalHistory) {
      return res.status(404).json({
        success: false,
        message: `No history found for hospital with ID ${hospitalId}`
      });
    }

    const historyContent = hospitalHistory.History;
    
    const paragraphRegex = /<p>(.*?)<\/p>/g;
    let match;
    let paragraphs = [];
    let paragraphCount = 1;
    
    while ((match = paragraphRegex.exec(historyContent)) !== null) {
      const paragraphContent = match[1].replace(/<.*?>/g, '');
      paragraphs.push({
        [`paragraph${paragraphCount}`]: paragraphContent.trim()
      });
      paragraphCount++;
    }

    if (paragraphs.length === 0 && historyContent) {
      const plainText = historyContent.replace(/<[^>]*>/g, '');
      if (plainText.trim()) {
        paragraphs.push({ paragraph1: plainText.trim() });
      }
    }

    return res.json({
      success: true,
      data: {
        _id: hospitalHistory._id,
        HospitalID: hospitalHistory.HospitalID,
        HospitalName: hospital.HospitalName,
        paragraphs: paragraphs
      }
    });
    
  } catch (error) {
    console.error("Error fetching hospital history:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching hospital history",
      error: error.message
    });
  }
};

module.exports = {
  getHospitalHistoryByHospitalId
};