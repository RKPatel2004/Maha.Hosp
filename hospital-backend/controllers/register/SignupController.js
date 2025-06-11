const bcrypt = require("bcryptjs");
const UserMaster = require("../../models/UserMaster");
const otpStore = require("../../utils/otpStore");

// Helper function to generate an auto-incremented _id
async function generateAutoIncrementedId() {
    // Find the document with the highest _id
    const lastFeedback = await UserMaster.findOne({}, { _id: 1 })
        .sort({ _id: -1 })
        .lean();

    // If collection is empty, start from 1, else increment the max _id by 1
    return lastFeedback ? lastFeedback._id + 1 : 1;
}

// Helper: Normalize mobile number to always have '91' + 10 digits
function normalizeMobileNo(mobileNo) {
    if (!mobileNo) return null;
    if (mobileNo.startsWith("91") && mobileNo.length === 12) {
        return mobileNo;
    } else if (mobileNo.length === 10) {
        return "91" + mobileNo;
    }
    return null;
}

// Send OTP to mobile number
const sendOtp = async (req, res) => {
    let { mobileNo } = req.body;
    mobileNo = normalizeMobileNo(mobileNo);

    if (!mobileNo) {
        return res.status(400).json({ message: "Mobile number must be 10 digits or start with '91' followed by 10 digits." });
    }

    // Check if mobile number is already used
    const existingMobile = await UserMaster.findOne({ MobileNo: mobileNo.slice(2) });
    if (existingMobile) {
        return res.status(400).json({ message: "Mobile number already registered" });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    const expiresAt = Date.now() + 2 * 60 * 1000; // 2 minutes validity

    otpStore.set(mobileNo, { otp, expiresAt });
    console.log(`OTP for ${mobileNo} is ${otp}`);

    // Simulate SMS sending here (e.g., Twilio)

    res.json({ message: "OTP sent successfully", OTP: otp, MobileNo: mobileNo});
};

// Verify OTP
const verifyOtp = (req, res) => {
    let { mobileNo, otp } = req.body;
    mobileNo = normalizeMobileNo(mobileNo);

    if (!mobileNo) {
        return res.status(400).json({ message: "Mobile number must be 10 digits or start with '91' followed by 10 digits." });
    }

    const record = otpStore.get(mobileNo);

    if (!record) {
        console.log(`No OTP record found for ${mobileNo}`);
        return res.status(400).json({ message: "No OTP sent to this number" });
    }

    if (Date.now() > record.expiresAt) {
        otpStore.delete(mobileNo);
        console.log(`OTP expired for ${mobileNo}`);
        return res.status(400).json({ message: "OTP expired" });
    }

    if (record.otp != otp) {
        console.log(`Invalid OTP entered for ${mobileNo}: Expected ${record.otp}, Got ${otp}`);
        return res.status(400).json({ message: "Invalid OTP" });
    }

    // On success, delete OTP so it cannot be reused
    otpStore.delete(mobileNo);

    res.json({ message: "OTP verified" });
};

// Register User
const registerUser = async (req, res) => {
    try {
        const { UserName, MobileNo, UserPassword, ConfirmPassword } = req.body;
        const mobileNo = normalizeMobileNo(MobileNo);

        if (!UserName || !mobileNo || !UserPassword || !ConfirmPassword)
            return res.status(400).json({ message: "All fields are required" });

        if (UserPassword !== ConfirmPassword)
            return res.status(400).json({ message: "Passwords do not match" });

        // Check if username already exists
        const existingUser = await UserMaster.findOne({ UserName });
        if (existingUser)
            return res.status(400).json({ message: "UserName already taken" });

        // Check if mobile number is already used (optional)
        const existingMobile = await UserMaster.findOne({ MobileNo: mobileNo.slice(2) });
        if (existingMobile)
            return res.status(400).json({ message: "Mobile number already registered" });

        const hashedPassword = await bcrypt.hash(UserPassword, 10);

        // Generate auto-incremented _id
        const _id = await generateAutoIncrementedId();

        const user = new UserMaster({
            _id,
            UserTypeID: 2,
            UserName,
            CountryCode: /*91*/mobileNo.slice(0, 2),
            MobileNo: mobileNo.slice(2), // Store only last 10 digits (without 91)
            UserPassword: hashedPassword,
            UniqueDeviceID: null,
            TokenID: null,
            Address: "",
            Pincode: "",
            EmailID: "",
            FilePath: "",
            IsWebsite: false,
            RegistrationDate: new Date()
        });

        await user.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    sendOtp,
    verifyOtp,
    registerUser
};
