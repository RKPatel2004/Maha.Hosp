const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserMaster = require("../../models/UserMaster");

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

// Login Controller
const loginUser = async (req, res) => {
    try {
        const { MobileNo, UserPassword } = req.body;

        const normalizedMobile = normalizeMobileNo(MobileNo);
        if (!normalizedMobile || !UserPassword) {
            return res.status(400).json({ message: "MobileNo and Password are required" });
        }

        const user = await UserMaster.findOne({ MobileNo: normalizedMobile });

        if (!user) {
            return res.status(401).json({ message: "User not found with this Mobile Number" });
        }

        const isMatch = await bcrypt.compare(UserPassword, user.UserPassword);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid password" });
        }

        // Create JWT token
        const token = jwt.sign(
            { userId: user._id, mobile: user.MobileNo, role: user.UserTypeID },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({ message: "Login successful", token });
    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    loginUser
};
