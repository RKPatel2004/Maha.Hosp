const HospitalHistory = require("../../../../models/HospitalHistory");
const HospitalMaster = require("../../../../models/HospitalMaster");

const getAllHospitals = async (req, res) => {
    const userId = req.user.userId || req.user.adminId;
    if (!userId) {
        res.status(404).json({
            success: false,
            message: "User ID not found in token"
        });
    }

    const hospitalHistory = await HospitalHistory.find({});

    if (hospitalHistory.length === 0) {
        res.status(200).json({
            success: true,
            count: 0,
            data: []
        });
    }

    let enrichedHospitalInfo = [];

    for (let history of hospitalHistory) {
        const enrichedHospital = {
            HospitalName: null,
            HospitalInformation: null
        };
        const hospital = await HospitalMaster.findById(history.HospitalID);
        enrichedHospital.HospitalName = hospital.HospitalName;
        enrichedHospital.HospitalInformation = history.History;

        enrichedHospitalInfo.push(enrichedHospital);
    }
    if (enrichedHospitalInfo.length == 0) {
        res.status(200).json({
            success: true,
            count: 0,
            data: []
        });
    }

    res.status(200).json({
        success: true,
        count: enrichedHospitalInfo.length,
        data: enrichedHospitalInfo
    });
};

const editHospital = async (req, res) => {
    try {
        const userId = req.user.userId || req.user.adminId;
        if (!userId) {
            return res.status(404).json({
                success: false,
                message: "User ID not found in token"
            });
        }

        const { HospitalName, HospitalInformation } = req.body;

        const existingHospital = await HospitalMaster.findOne({ HospitalName: HospitalName });

        if (!existingHospital) {
            return res.status(404).json({
                success: false,
                message: "Hospital not found"
            });
        }

        const hospitalId = existingHospital._id;
        const hospitalHistory = await HospitalHistory.findOne({ HospitalID: existingHospital._id });

        console.log({HospitalInformation : hospitalHistory.History});

        hospitalHistory.HospitalInformation = HospitalInformation;

        await HospitalHistory.findOneAndUpdate({ HospitalID: hospitalId }, 
            { History: HospitalInformation }, 
            { upsert: true });

        return res.status(200).json({
            success: true,
            message: "Hospital information updated successfully"
        });
    } catch (error) {
        console.error("Error fetching hospitals:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

module.exports = { getAllHospitals, editHospital };