const UserMaster = require("../../models/UserMaster");
const otpStore = require("../../utils/otpStore");
const bcrypt = require("bcryptjs");

// Normalize mobile number
function normalizeMobileNo(mobileNo) {
    if (!mobileNo) return null;
    if (mobileNo.startsWith("91") && mobileNo.length === 12) return mobileNo;
    if (mobileNo.length === 10) return "91" + mobileNo;
    return null;
}

// Step 1: Send OTP if user exists
const sendOtpIfUserExists = async (req, res) => {
    let { mobileNo } = req.body;
    mobileNo = normalizeMobileNo(mobileNo);

    if (!mobileNo) {
        return res.status(400).json({ message: "Invalid Mobile Number" });
    }

    const user = await UserMaster.findOne({ MobileNo: mobileNo.slice(2) });

    if (!user) {
        return res.status(404).json({ message: "Mobile number not registered" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    const expiresAt = Date.now() + 2 * 60 * 1000; // 2 min validity

    otpStore.set(mobileNo, { otp, expiresAt });
    console.log(`Forgot Password OTP for ${mobileNo} is ${otp}`);

    res.json({ message: "OTP sent successfully", MobileNo: mobileNo, OTP: otp });
};

// Step 2: Verify OTP
const verifyOtp = (req, res) => {
    let { mobileNo, otp } = req.body;
    mobileNo = normalizeMobileNo(mobileNo);

    if (!mobileNo) {
        return res.status(400).json({ message: "Invalid Mobile Number" });
    }

    const record = otpStore.get(mobileNo);
    if (!record) {
        return res.status(400).json({ message: "No OTP found" });
    }

    if (Date.now() > record.expiresAt) {
        otpStore.delete(mobileNo);
        return res.status(400).json({ message: "OTP expired" });
    }

    if (record.otp != otp) {
        return res.status(400).json({ message: "Invalid OTP" });
    }

    otpStore.delete(mobileNo);
    res.json({ message: "OTP verified" });
};

// Step 3: Reset Password
const resetPassword = async (req, res) => {
    const { mobileNo, newPassword, confirmPassword } = req.body;
    const normalizedNo = normalizeMobileNo(mobileNo);

    if (!normalizedNo) {
        return res.status(400).json({ message: "Invalid Mobile Number" });
    }

    if (!newPassword || !confirmPassword) {
        return res.status(400).json({ message: "Password fields required" });
    }

    if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
    }

    const user = await UserMaster.findOne({ MobileNo: normalizedNo.slice(2) });
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.UserPassword = hashedPassword;
    await user.save();

    res.json({ message: "Password reset successfully" });
};

module.exports = {
    sendOtpIfUserExists,
    verifyOtp,
    resetPassword
};
