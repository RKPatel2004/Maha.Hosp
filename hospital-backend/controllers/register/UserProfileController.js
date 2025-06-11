const UserMaster = require("../../models/UserMaster");
const fs = require("fs");
const path = require("path");

const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(400).json({ 
                success: false,
                message: "User ID not found in token" 
            });
        }

        const user = await UserMaster.findOne(
            { _id: userId },
            { 
                UserName: 1, 
                EmailID: 1, 
                Address: 1, 
                Pincode: 1, 
                FilePath: 1,
                CountryCode: 1,
                MobileNo: 1,
                _id: 1
            }
        );

        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: "User not found" 
            });
        }

        res.status(200).json({
            success: true,
            message: "User profile retrieved successfully",
            data: {
                userId: user._id,
                userName: user.UserName,
                emailId: user.EmailID,
                address: user.Address,
                pincode: user.Pincode,
                filePath: user.FilePath,
                mobileNo: '+' + user.CountryCode + user.MobileNo
            }
        });

    } catch (error) {
        console.error("Get User Profile Error:", error);
        res.status(500).json({ 
            success: false,
            message: "Server error while fetching user profile" 
        });
    }
};

const editUserProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { UserName, EmailID, Address, Pincode } = req.body;

        if (!userId) {
            return res.status(400).json({ 
                success: false,
                message: "User ID not found in token" 
            });
        }

        const updateFields = {
            ...(UserName && { UserName }),
            ...(EmailID && { EmailID }),
            ...(Address && { Address }),
            ...(Pincode && { Pincode })
        };

        if (req.file) {
            const currentUser = await UserMaster.findById(userId);
            
            if (currentUser && currentUser.FilePath) {
                const oldFilePath = path.join(__dirname, '../../', currentUser.FilePath);
                if (fs.existsSync(oldFilePath)) {
                    try {
                        fs.unlinkSync(oldFilePath);
                    } catch (deleteError) {
                        console.warn("Warning: Could not delete old profile image:", deleteError);
                    }
                }
            }

            updateFields.FilePath = req.file.path;
        }

        const updatedUser = await UserMaster.findOneAndUpdate(
            { _id: userId },
            updateFields,
            { 
                new: true,
                select: 'UserName EmailID Address Pincode FilePath MobileNo _id'
            }
        );

        if (!updatedUser) {
            return res.status(404).json({ 
                success: false,
                message: "User not found" 
            });
        }

        res.status(200).json({
            success: true,
            message: "User profile updated successfully",
            data: {
                userId: updatedUser._id,
                userName: updatedUser.UserName,
                emailId: updatedUser.EmailID,
                address: updatedUser.Address,
                pincode: updatedUser.Pincode,
                filePath: updatedUser.FilePath,
                mobileNo: updatedUser.MobileNo
            }
        });

    } catch (error) {
        console.error("Edit User Profile Error:", error);
        
        // If there was an error and a file was uploaded, clean it up
        if (req.file) {
            try {
                fs.unlinkSync(req.file.path);
            } catch (cleanupError) {
                console.warn("Warning: Could not clean up uploaded file:", cleanupError);
            }
        }
        
        res.status(500).json({ 
            success: false,
            message: "Server error while updating user profile" 
        });
    }
};

module.exports = { 
    getUserProfile,
    editUserProfile
};