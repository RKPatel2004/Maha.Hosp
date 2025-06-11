const CareerMaster = require("../models/CareerMaster");

async function generateAutoIncrementedId() {
    // Find the document with the highest _id
    const lastCareerMaster = await CareerMaster.findOne({}, { _id: 1 })
        .sort({ _id: -1 })
        .lean();

    return lastCareerMaster ? lastCareerMaster._id + 1 : 1;
}

const SubmitCareerForm = async (req, res) => {
    try {
        const {
            CareerOpeningID,
            DepartmentID,
            DesignationID,
            FullName,
            Gender,
            // CountryCode, // will be set to 91
            MobileNo,
            EmailID,
            Qualification,
            TotalExperience,
            Remarks
        } = req.body;

        // File path from multer
        const FilePath = req.file ? req.file.path : null;

        // Validation
        if (!CareerOpeningID || !DepartmentID || !DesignationID || !FullName || !MobileNo || !EmailID) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Generate auto-incremented _id
        const _id = await generateAutoIncrementedId();

        const careerMaster = new CareerMaster({
            _id,
            CareerOpeningID,
            DepartmentID,
            DesignationID,
            FullName,
            Gender,
            CountryCode: 91, // Set to 91
            MobileNo,
            EmailID,
            Qualification,
            TotalExperience,
            FilePath,
            Remarks,
            IsRead: false // Set to false
        });

        const result = await careerMaster.save();
        res.status(200).send(result);
    } catch (err) {
        res.status(500).send(err);
        console.log(err);
    }
};

module.exports = { SubmitCareerForm };
