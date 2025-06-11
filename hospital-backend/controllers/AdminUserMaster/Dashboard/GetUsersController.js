const UserMaster = require("../../../models/UserMaster");

const getAllPatients = async (req, res) => {
    try {
        console.log("Token payload:", req.user); // Debug log
        // const userId = req.user.userId;
        const userId = req.user.userId || req.user.adminId;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID not found in token"
            });
        }

        const patients = await UserMaster.find(
            { UserTypeID: 2 },
            {
                UserName: 1,
                RegistrationDate: 1,
                CountryCode: 1,
                MobileNo: 1,
                Pincode: 1,
                EmailID: 1,
                FilePath: 1
            }
        );

        // Fixed: Added return statement and fixed typo
        if (!patients || patients.length === 0) {
            return res.status(200).json({ // Changed to 200 since it's not an error, just empty results
                success: true,
                message: "No patients found",
                count: 0,
                data: []
            });
        }

        // Fixed: Corrected typo from 'suceess' to 'success'
        res.status(200).json({
            success: true,
            count: patients.length,
            data: patients.map(patient => ({
                UserName: patient.UserName,
                RegistrationDate: patient.RegistrationDate,
                MobileNo: patient.CountryCode && patient.MobileNo ? 
                    /*'+' + patient.CountryCode +*/ patient.MobileNo : 
                    patient.MobileNo || 'N/A',
                Pincode: patient.Pincode,
                EmailID: patient.EmailID,
                FilePath: patient.FilePath
            }))
        });
    } catch (error) {
        console.error("Error in getAllPatients:", error); // Debug log
        res.status(500).json({
            success: false,
            message: "Server error",
            error: "Error fetching patients"
        });
    }
};

const getAllDoctors = async (req, res) => {
    try {
        console.log("Token payload:", req.user); // Debug log
        // const userId = req.user.userId;
        const userId = req.user.userId || req.user.adminId;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID not found in token"
            });
        }

        const doctors = await UserMaster.find(
            { UserTypeID: 1 },
            {
                UserName: 1,
                RegistrationDate: 1,
                CountryCode: 1,
                MobileNo: 1,
                Pincode: 1,
                EmailID: 1,
                FilePath: 1
            }
        );

        // Even if no doctors found, return success with empty array
        res.status(200).json({
            success: true,
            count: doctors.length,
            data: doctors.map((doctor) => ({
                UserName: doctor.UserName,
                RegistrationDate: doctor.RegistrationDate,
                MobileNo: doctor.CountryCode && doctor.MobileNo ? 
                    /*"+" + doctor.CountryCode +*/ doctor.MobileNo : 
                    doctor.MobileNo || 'N/A',
                Pincode: doctor.Pincode,
                EmailID: doctor.EmailID,
                FilePath: doctor.FilePath
            }))
        });
    } catch (error) {
        console.error("Error in getAllDoctors:", error); // Debug log
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: "Error fetching doctors"
        });
    }
};

const getFilteredPatients = async (req, res) => {
    try {
        // const userId = req.user.userId;
        const userId = req.user.userId || req.user.adminId;


        const { UserName, MobileNo } = req.body;
        
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID not found in token"
            });
        }

        const filterPatientConditions = [{ UserTypeID: 2 }];

        if (UserName) filterPatientConditions.push({ UserName: { $regex: UserName, $options: "i" } });
        if (MobileNo) filterPatientConditions.push({ MobileNo: { $regex: MobileNo, $options: "i" } });
            
        const filteredPatients = await UserMaster.find(
            {
                $and: filterPatientConditions
            },
            {
                UserName: 1,
                RegistrationDate: 1,
                CountryCode: 1,
                MobileNo: 1,
                Pincode: 1,
                EmailID: 1,
                FilePath: 1
            }
        );

        res.status(200).json({
            success: true,
            count: filteredPatients.length,
            data: filteredPatients.map((patient) => ({
                UserName: patient.UserName,
                RegistrationDate: patient.RegistrationDate,
                MobileNo: patient.CountryCode && patient.MobileNo ? 
                    /*"+" + patient.CountryCode +*/ patient.MobileNo : 
                    patient.MobileNo || 'N/A',
                Pincode: patient.Pincode,
                EmailID: patient.EmailID,
                FilePath: patient.FilePath
            }))
        });
    } catch (error) {
        console.error("Error in getFilteredPatients:", error);
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: "Error filtering patients"
        });
    }
};

const getFilteredDoctors = async (req, res) => {
    try {
        // const userId = req.user.userId;
        const userId = req.user.userId || req.user.adminId;


        const { UserName, MobileNo } = req.body;
        
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID not found in token"
            });
        }

        const filterDoctorConditions = [{ UserTypeID: 1 }];

        if (UserName) filterDoctorConditions.push({ UserName: { $regex: UserName, $options: "i" } });
        if (MobileNo) filterDoctorConditions.push({ MobileNo: { $regex: MobileNo, $options: "i" } });

        const filteredDoctors = await UserMaster.find(
            { $and: filterDoctorConditions },
            {
                UserName: 1,
                RegistrationDate: 1,
                CountryCode: 1,
                MobileNo: 1,
                Pincode: 1,
                EmailID: 1,
                FilePath: 1,
                Address: 1
            }
        );
        
        res.status(200).json({
            success: true,
            count: filteredDoctors.length,
            data: filteredDoctors.map((doctor) => ({
                UserName: doctor.UserName,
                RegistrationDate: doctor.RegistrationDate,
                MobileNo: doctor.CountryCode && doctor.MobileNo ? 
                    /*"+" + doctor.CountryCode +*/ doctor.MobileNo : 
                    doctor.MobileNo || 'N/A',
                Pincode: doctor.Pincode,
                EmailID: doctor.EmailID,
                FilePath: doctor.FilePath,
                Address: doctor.Address
            }))
        });
    } catch (error) {
        console.error("Error in getFilteredDoctors:", error);
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: "Error filtering doctors"
        });
    }
};

module.exports = { getAllPatients, getAllDoctors, getFilteredPatients, getFilteredDoctors };