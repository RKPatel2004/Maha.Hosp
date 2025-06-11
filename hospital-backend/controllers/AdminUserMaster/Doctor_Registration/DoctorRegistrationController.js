const UserMaster = require("../../../models/UserMaster");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");

const getNextUserId = async () => {
    try {
        const lastUser = await UserMaster.findOne().sort({ _id: -1 });
        return lastUser ? lastUser._id + 1 : 1;
    } catch (error) {
        throw new Error("Error generating user ID");
    }
};

const registerDoctor = async (req, res) => {
    try {
        console.log("=== Doctor Registration Request ===");
        console.log("Body:", req.body);
        console.log("File:", req.file);

        const { 
            UserName, 
            UserPassword, 
            ConfirmUserPassword,
            MobileNo,  
            Pincode = "",
            EmailID, 
            Address = "" 
        } = req.body;

        if (!UserName || !UserPassword || !ConfirmUserPassword || !EmailID || !MobileNo) {
            if (req.file) {
                fs.unlink(req.file.path, (err) => {
                    if (err) console.error("Error deleting uploaded file:", err);
                });
            }
            return res.status(400).json({
                success: false,
                message: "UserName, UserPassword, ConfirmUserPassword, and EmailID are required"
            });
        }

        if (UserPassword !== ConfirmUserPassword) {
            if (req.file) {
                fs.unlink(req.file.path, (err) => {
                    if (err) console.error("Error deleting uploaded file:", err);
                });
            }
            return res.status(400).json({
                success: false,
                message: "Passwords do not match"
            });
        }

        const existingUser = await UserMaster.findOne({ EmailID: EmailID });
        if (existingUser) {
            if (req.file) {
                fs.unlink(req.file.path, (err) => {
                    if (err) console.error("Error deleting uploaded file:", err);
                });
            }
            return res.status(400).json({
                success: false,
                message: "Email already registered"
            });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(UserPassword, saltRounds);

        const nextUserId = await getNextUserId();

        const userData = {
            _id: nextUserId,
            UserTypeID: 1,
            UserName: UserName,
            Address: Address || "",
            Pincode: Pincode || "",
            CountryCode: 91,
            MobileNo: MobileNo,
            EmailID: EmailID,
            UserPassword: hashedPassword,
            UniqueDeviceID: null,
            TokenID: null,
            IsWebsite: false,
            FilePath: req.file ? req.file.path : "",
            RegistrationDate: new Date()
        };

        console.log("User data to save:", userData);

        const newUser = new UserMaster(userData);
        await newUser.save();

        console.log("Doctor registered successfully with ID:", nextUserId);

        const { UserPassword: _, ...userResponse } = userData;
        res.status(201).json({
            success: true,
            message: "Doctor registered successfully",
            data: {
                ...userResponse,
                UserPassword: undefined
            }
        });

    } catch (error) {
        console.error("Doctor registration error:", error);
        
        if (req.file) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error("Error deleting uploaded file:", err);
            });
        }

        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

const getDoctor = async(req, res) => {
    try{

        const userId = req.user.userId || req.user.adminId;
        if(!userId){
            return res.status(400).json({
                success: false,
                message: "User ID not found in token"
            });
        }

        const {MobileNo} = req.body;
        const doctor = await UserMaster.find(
            {MobileNo: MobileNo},
            {
                UserName: 1,
                RegistrationDate: 1,
                CountryCode: 1,
                MobileNo: 1,
                Pincode: 1,
                EmailID: 1,
                Address: 1,
                FilePath: 1
            }
        );
        res.status(200).json({
            success: true,
            data: doctor.map((dr)=> ({
                UserName: dr.UserName || "N/A",
                RegistrationDate: dr.RegistrationDate || "N/A",
                MobileNo: dr.MobileNo || "N/A",
                Pincode: dr.Pincode || "N/A",
                EmailID: dr.EmailID || "N/A",
                Address: dr.Address || "N/A",
                FilePath: dr.FilePath || "N/A"
            }))
        });
    }catch(error){
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

module.exports = { registerDoctor, getDoctor };