const DepartmentMaster = require("../../../models/DepartmentMaster");
const DepartmentMobileNo = require("../../../models/DepartmentMobileNo");
const DepartmentEmail = require("../../../models/DepartmentEmail");
const HospitalMaster = require("../../../models/HospitalMaster");

async function generateAutoIncrementedId_DepartmentMaster() {
    const lastDepartment = await DepartmentMaster.findOne({}, { _id: 1 })
        .sort({ _id: -1 })
        .lean();
    return lastDepartment ? lastDepartment._id + 1 : 1;
}

async function generateAutoIncrementedId_DepartmentMobileNo() {
    const lastDepartmentMobile = await DepartmentMobileNo.findOne({}, { _id: 1 })
        .sort({ _id: -1 })
        .lean();
    return lastDepartmentMobile ? lastDepartmentMobile._id + 1 : 1;
}

async function generateAutoIncrementedId_DepartmentEmail() {
    const lastDepartmentEmail = await DepartmentEmail.findOne({}, { _id: 1 })
        .sort({ _id: -1 })
        .lean();
    return lastDepartmentEmail ? lastDepartmentEmail._id + 1 : 1;
}

const SubmitDepartment = async (req, res) => {
    try {
        const userId = req.user.userId || req.user.adminId;

        // Log the request body for debugging
        console.log("Request body:", req.body);

        const {
            HospitalName,
            DepartmentName,
            MobileNo,
            PhoneNo,
            EmailID
        } = req.body || {};

        // Log extracted values for debugging
        console.log("Extracted values:", { HospitalName, DepartmentName, MobileNo, PhoneNo, EmailID });

        // Validate required fields
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID not found in token"
            });
        }

        if (!HospitalName || !DepartmentName) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: HospitalName and DepartmentName are required",
                received: { HospitalName, DepartmentName }
            });
        }

        // Find hospital by name
        const hospital = await HospitalMaster.findOne({ HospitalName: HospitalName });
        
        if (!hospital) {
            return res.status(400).json({
                success: false,
                message: "Hospital not found with the provided name"
            });
        }

        const hospitalId = hospital._id;

        // Generate ID for DepartmentMaster
        const DepartmentMaster_id = await generateAutoIncrementedId_DepartmentMaster();

        // Create new department
        const newDepartment = new DepartmentMaster({
            _id: DepartmentMaster_id,
            HospitalID: hospitalId,
            DepartmentName: DepartmentName, // This was missing!
            IsDisplay: false, // Changed to true as default
            InsertBy: userId,
            UpdateBy: userId,
            InsertTime: new Date(),
            UpdateTime: new Date(),
        });

        await newDepartment.save();

        if (MobileNo || PhoneNo) {
            const mobileNumbers = Array.isArray(MobileNo) ? MobileNo : /*(MobileNo ? */[MobileNo]/* : [])*/;
            const phoneNumbers = Array.isArray(PhoneNo) ? PhoneNo : /*(PhoneNo ? */[PhoneNo]/* : [])*/;
            
            const maxLength = Math.max(mobileNumbers.length, phoneNumbers.length);
            
            for (let i = 0; i < maxLength; i++) {
                const DepartmentMobileNo_id = await generateAutoIncrementedId_DepartmentMobileNo();
                
                const newDepartmentMobileNo = new DepartmentMobileNo({
                    _id: DepartmentMobileNo_id,
                    DepartmentID: newDepartment._id,
                    MobileNo: mobileNumbers[i] ? parseInt(mobileNumbers[i]) : null,
                    PhoneNo: phoneNumbers[i] ? parseInt(phoneNumbers[i]) : null
                });

                await newDepartmentMobileNo.save();
            }
        }

        // Handle Email if provided (can also be multiple)
        if (EmailID) {
            // Convert to array if it's not already an array
            const emailAddresses = Array.isArray(EmailID) ? EmailID : [EmailID];
            
            // Create entries for each email
            for (let i = 0; i < emailAddresses.length; i++) {
                const DepartmentEmail_id = await generateAutoIncrementedId_DepartmentEmail();
                
                const newDepartmentEmail = new DepartmentEmail({
                    _id: DepartmentEmail_id,
                    DepartmentID: newDepartment._id,
                    EmailID: emailAddresses[i]
                });

                await newDepartmentEmail.save();
            }
        }

        // Send single response with all data
        res.status(200).json({
            success: true,
            message: "Department submitted successfully",
            data: {
                department: newDepartment,
                departmentId: newDepartment._id
            }
        });

    } catch (error) {
        console.error("Error in SubmitDepartment:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

const DeleteDepartment = async (req, res) => {
    try{
        const userId = req.user.userId || req.user.adminId;

        if(!userId){
            return res.status(400).json({
                success: false,
                message: "User ID not found in token"
            });
        }

        const department = await DepartmentMaster.findById(req.params.id);
        const departmentId = req.params.id;

        if(!department)
        {
            return res.status(404).json({
                success: false,
                message: "Department not found"
            });
        }

        await department.deleteOne();

        await DepartmentMobileNo.deleteMany({DepartmentID: departmentId});
        await DepartmentEmail.deleteMany({DepartmentID: departmentId});

        res.status(200).json({
            success: true,
            message: "Department deleted successfully"
        });
    }catch{
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

module.exports = { SubmitDepartment, DeleteDepartment };