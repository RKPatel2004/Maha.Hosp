const HospitalMaster = require("../models/HospitalMaster");

const getAllHospitals = async(req, res) => {
    try {
        const hospitals = await HospitalMaster.find({});
        res.status(200).json({
            success: true,
            count: hospitals.length,
            data: hospitals
        });
    } catch (error) {
        console.error("Error fetching hospitals:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
}

module.exports = { getAllHospitals };
