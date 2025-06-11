const DepartmentMaster = require("../../../models/DepartmentMaster");
const DepartmentMobileNo = require("../../../models/DepartmentMobileNo");
const DepartmentEmail = require("../../../models/DepartmentEmail");
const HospitalMaster = require("../../../models/HospitalMaster");

const getAllDepartments = async (req, res) => {
    try {
        const departments = await DepartmentMaster.find({});

        if (departments.length == 0) {
            return res.status(404).json({
                success: false,
                message: "No departments found"
            });
        }

        let retrievedDepartments = [];
        for (let dept of departments) {
            let retrievedDept = {
                _id: dept._id,
                DepartmentName: dept.DepartmentName,
                IsDisplay: dept.IsDisplay,
                InsertBy: dept.InsertBy,
                UpdateBy: dept.UpdateBy,
                InsertTime: dept.InsertTime,
                UpdateTime: dept.UpdateTime
            };

            if (dept.HospitalID) {
                const hospital = await HospitalMaster.findById(dept.HospitalID);
                retrievedDept.HospitalName = hospital.HospitalName;
            }

            await DepartmentMobileNo.find({ DepartmentID: dept._id }).then((MobileNo) => {
                retrievedDept.ContactInfo = MobileNo;
            });

            await DepartmentEmail.find({ DepartmentID: dept._id }).then((EmailID) => {
                retrievedDept.EmailID = EmailID;
            });

            retrievedDepartments.push(retrievedDept);
        }
        if (retrievedDepartments.length > 0) {
            res.status(200).json({
                success: true,
                count: retrievedDepartments.length,
                message: "Departments fetched successfully",
                data: retrievedDepartments
            });
        }
        else {
            res.status(404).json({
                success: false,
                message: "No departments found"
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: "Error fetching departments"
        });
    }
};

const editDepartment = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const existingDepartment = await DepartmentMaster.findById(id);
        if (!existingDepartment) {
            return res.status(404).json({
                success: false,
                message: "Department not found"
            });
        }

        const { ContactInfo, EmailID, ...departmentData } = updateData;

        const updatedDepartment = await DepartmentMaster.findByIdAndUpdate(
            id,
            {
                ...departmentData,
                UpdateTime: new Date()
            },
            { new: true, runValidators: true }
        );

        if (ContactInfo && Array.isArray(ContactInfo)) {
            await DepartmentMobileNo.deleteMany({ DepartmentID: id });

            const lastMobileRecord = await DepartmentMobileNo.findOne().sort({ _id: -1 });
            let nextMobileId = lastMobileRecord ? lastMobileRecord._id + 1 : 1;

            const mobileNumbers = ContactInfo.map(contact => ({
                _id: nextMobileId++,
                DepartmentID: parseInt(id),
                MobileNo: contact.MobileNo || null,
                PhoneNo: contact.PhoneNo || null
            }));

            if (mobileNumbers.length > 0) {
                await DepartmentMobileNo.insertMany(mobileNumbers);
            }
        }

        if (EmailID && Array.isArray(EmailID)) {
            await DepartmentEmail.deleteMany({ DepartmentID: id });

            const lastEmailRecord = await DepartmentEmail.findOne().sort({ _id: -1 });
            let nextEmailId = lastEmailRecord ? lastEmailRecord._id + 1 : 1;

            const emailAddresses = EmailID.map(email => ({
                _id: nextEmailId++,
                DepartmentID: parseInt(id),
                EmailID: email.EmailID || email
            }));

            if (emailAddresses.length > 0) {
                await DepartmentEmail.insertMany(emailAddresses);
            }
        }

        let retrievedDept = {
            _id: updatedDepartment._id,
            DepartmentName: updatedDepartment.DepartmentName,
            IsDisplay: updatedDepartment.IsDisplay,
            InsertBy: updatedDepartment.InsertBy,
            UpdateBy: updatedDepartment.UpdateBy,
            InsertTime: updatedDepartment.InsertTime,
            UpdateTime: updatedDepartment.UpdateTime
        };

        if (updatedDepartment.HospitalID) {
            const hospital = await HospitalMaster.findById(updatedDepartment.HospitalID);
            if (hospital) {
                retrievedDept.HospitalName = hospital.HospitalName;
            }
        }

        const mobileNumbers = await DepartmentMobileNo.find({ DepartmentID: parseInt(id) });
        retrievedDept.ContactInfo = mobileNumbers;

        const emailAddresses = await DepartmentEmail.find({ DepartmentID: parseInt(id) });
        retrievedDept.EmailID = emailAddresses;

        res.status(200).json({
            success: true,
            message: "Department updated successfully",
            data: retrievedDept
        });

    } catch (error) {
        console.error('Edit Department Error:', error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: "Error updating department"
        });
    }
};

const searchDepartment = async (req, res) => {
    try {
        const userId = req.user.userId || req.user.adminId;

        const {HospitalName, DepartmentName} = req.body || {};

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID not found in token"
            });
        }

        const departments = await DepartmentMaster.find({});

        if(departments.length === 0)
        {
            res.status(404).json({
                success: false,
                message: "No departments found"
            });
        }

        let retrievedDepartments = [];

        for(let dept of departments)
        {
            let retrievedDept = {
                _id: dept._id,
                DepartmentName: dept.DepartmentName,
                IsDisplay: dept.IsDisplay,
                InsertBy: dept.InsertBy,
                UpdateBy: dept.UpdateBy,
                InsertTime: dept.InsertTime,
                UpdateTime: dept.UpdateTime
            };

            if(dept.HospitalID)
            {
                const hospitalId = await HospitalMaster.findById({_id: dept.HospitalID});
                retrievedDept.HospitalName = hospitalId.HospitalName;
            }

            await DepartmentMobileNo.find({DepartmentID: dept._id}).then((MobileNo) => {
                retrievedDept.ContactInfo = MobileNo;
            });

            await DepartmentEmail.find({DepartmentID: dept._id}).then((EmailID) => {
                retrievedDept.EmailID = EmailID;
            }); 

            let isInclude = true;

            if(HospitalName || DepartmentName)
            {
                isInclude = true;

                if(HospitalName && DepartmentName)
                {
                    isInclude = retrievedDept.HospitalName == HospitalName && retrievedDept.DepartmentName == DepartmentName;
                }
                else if(HospitalName && !DepartmentName)
                {
                    isInclude = retrievedDept.HospitalName == HospitalName;
                }
                else if(!HospitalName && DepartmentName)
                {
                    isInclude = retrievedDept.DepartmentName == DepartmentName;
                }
            }

            if(isInclude)
            {
                retrievedDepartments.push(retrievedDept);
            }
        }

        res.status(200).json({
            success: true,
            message: "Departments found successfully",
            data: retrievedDepartments
        });
    }catch(error){
        res.status(500).json({
            success: false,
            message: "Server error",
            error: "Error searching department"
        });
    }
};

module.exports = { getAllDepartments, editDepartment, searchDepartment };