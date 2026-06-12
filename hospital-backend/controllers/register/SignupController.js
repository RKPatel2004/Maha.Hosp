const bcrypt = require("bcryptjs");
const UserMaster = require("../../models/UserMaster");
const otpStore = require("../../utils/otpStore");

async function generateAutoIncrementedId() {
    const lastFeedback = await UserMaster.findOne({}, { _id: 1 })
        .sort({ _id: -1 })
        .lean();

    return lastFeedback ? lastFeedback._id + 1 : 1;
}

function normalizeMobileNo(mobileNo) {
    if (!mobileNo) return null;
    if (mobileNo.startsWith("91") && mobileNo.length === 12) {
        return mobileNo;
    } else if (mobileNo.length === 10) {
        return "91" + mobileNo;
    }
    return null;
}

const sendOtp = async (req, res) => {
    let { mobileNo } = req.body;
    mobileNo = normalizeMobileNo(mobileNo);

    if (!mobileNo) {
        return res.status(400).json({ message: "Mobile number must be 10 digits or start with '91' followed by 10 digits." });
    }

    const existingMobile = await UserMaster.findOne({ MobileNo: mobileNo.slice(2) });
    if (existingMobile) {
        return res.status(400).json({ message: "Mobile number already registered" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    const expiresAt = Date.now() + 2 * 60 * 1000; 

    otpStore.set(mobileNo, { otp, expiresAt });
    console.log(`OTP for ${mobileNo} is ${otp}`);

    res.json({ message: "OTP sent successfully", OTP: otp, MobileNo: mobileNo});
};

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

    otpStore.delete(mobileNo);

    res.json({ message: "OTP verified" });
};

const registerUser = async (req, res) => {
    try {
        const { UserName, MobileNo, UserPassword, ConfirmPassword } = req.body;
        const mobileNo = normalizeMobileNo(MobileNo);

        if (!UserName || !mobileNo || !UserPassword || !ConfirmPassword)
            return res.status(400).json({ message: "All fields are required" });

        if (UserPassword !== ConfirmPassword)
            return res.status(400).json({ message: "Passwords do not match" });

        const existingUser = await UserMaster.findOne({ UserName });
        if (existingUser)
            return res.status(400).json({ message: "UserName already taken" });

        const existingMobile = await UserMaster.findOne({ MobileNo: mobileNo.slice(2) });
        if (existingMobile)
            return res.status(400).json({ message: "Mobile number already registered" });

        const hashedPassword = await bcrypt.hash(UserPassword, 10);

        const _id = await generateAutoIncrementedId();

        const user = new UserMaster({
            _id,
            UserTypeID: 2,
            UserName,
            CountryCode: /*91*/mobileNo.slice(0, 2),
            MobileNo: mobileNo.slice(2), 
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
