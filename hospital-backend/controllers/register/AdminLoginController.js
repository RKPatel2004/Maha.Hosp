const jwt = require("jsonwebtoken");
const AdminUserMaster = require("../../models/AdminUserMaster");

// Normalize mobile number (ensure consistency)
function normalizeMobileNo(mobileNo) {
    if (!mobileNo) return null;
    if (mobileNo.startsWith("91") && mobileNo.length === 12) {
        return mobileNo.slice(2); // Return only 10-digit mobile
    } else if (mobileNo.length === 10) {
        return mobileNo;
    }
    return null;
}

// Admin Login Controller
const adminLoginUser = async (req, res) => {
    try {
        const { MobileNo, Password } = req.body;

        // Validate input
        if (!MobileNo || !Password) {
            return res.status(400).json({ message: "MobileNo and Password are required" });
        }

        const normalizedMobile = normalizeMobileNo(MobileNo);
        if (!normalizedMobile) {
            return res.status(400).json({ message: "Invalid mobile number format" });
        }

        // Find admin in database by mobile number
        const admin = await AdminUserMaster.findOne({ MobileNo: normalizedMobile });

        if (!admin) {
            return res.status(401).json({ message: "Invalid admin credentials" });
        }

        // Compare password with database password
        if (admin.Password !== Password) {
            return res.status(401).json({ message: "Invalid admin credentials" });
        }

        // Create JWT token
        const token = jwt.sign(
            { 
                adminId: admin._id, 
                mobile: admin.MobileNo, 
                userName: admin.UserName,
                role: "admin" 
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // Decode the token to show its contents
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        res.json({
            message: "Admin login successful",
            token,
            decoded: {
                adminId: decoded.adminId,
                mobile: decoded.mobile,
                userName: decoded.userName,
                role: decoded.role,
                issuedAt: new Date(decoded.iat * 1000).toISOString(),
                expiresAt: new Date(decoded.exp * 1000).toISOString()
            }
        });

    } catch (err) {
        console.error("Admin Login Error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    adminLoginUser
};
