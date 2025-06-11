const UserMaster = require("../../../models/UserMaster");
const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require("fs");

const editDoctor = async (req, res) => {
    try {
        console.log("=== Edit Doctor Request ===");
        console.log("Request body:", req.body);
        console.log("Request file:", req.file);
        
        const { MobileNo, UserName, UserPassword, Pincode, EmailID, Address } = req.body;

        // Validate required fields
        if (!MobileNo) {
            return res.status(400).json({
                success: false,
                message: "Mobile number is required"
            });
        }

        // Find the doctor by mobile number
        const existingDoctor = await UserMaster.findOne({ MobileNo: MobileNo });
        
        if (!existingDoctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found with this mobile number"
            });
        }

        console.log("Found doctor:", existingDoctor);

        // Prepare update object
        const updateData = {};

        // Update fields if provided
        if (UserName) updateData.UserName = UserName;
        if (Pincode) updateData.Pincode = Pincode;
        if (EmailID) updateData.EmailID = EmailID;
        if (Address) updateData.Address = Address;

        // Handle password update
        if (UserPassword) {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(UserPassword, saltRounds);
            updateData.UserPassword = hashedPassword;
            console.log("Password will be updated");
        }

        // Handle file upload
        if (req.file) {
            // Delete old file if exists
            if (existingDoctor.FilePath) {
                const oldFilePath = path.join(__dirname, "..", existingDoctor.FilePath);
                if (fs.existsSync(oldFilePath)) {
                    try {
                        fs.unlinkSync(oldFilePath);
                        console.log("Old file deleted:", existingDoctor.FilePath);
                    } catch (error) {
                        console.error("Error deleting old file:", error);
                    }
                }
            }

            // Set new file path
            updateData.FilePath = `uploads/profile/${req.file.filename}`;
            console.log("New file uploaded:", updateData.FilePath);
        }

        // Update the doctor record
        const updatedDoctor = await UserMaster.findOneAndUpdate(
            { MobileNo: MobileNo },
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedDoctor) {
            return res.status(500).json({
                success: false,
                message: "Failed to update doctor record"
            });
        }

        console.log("Doctor updated successfully:", updatedDoctor);

        // Remove password from response
        const doctorResponse = updatedDoctor.toObject();
        delete doctorResponse.UserPassword;

        res.status(200).json({
            success: true,
            message: "Doctor updated successfully",
            data: doctorResponse
        });

    } catch (error) {
        console.error("Error updating doctor:", error);
        
        // Delete uploaded file if there was an error
        if (req.file) {
            const filePath = path.join(__dirname, "..", "uploads", "profile", req.file.filename);
            if (fs.existsSync(filePath)) {
                try {
                    fs.unlinkSync(filePath);
                    console.log("Uploaded file deleted due to error");
                } catch (deleteError) {
                    console.error("Error deleting uploaded file:", deleteError);
                }
            }
        }

        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

module.exports = {
    editDoctor
};