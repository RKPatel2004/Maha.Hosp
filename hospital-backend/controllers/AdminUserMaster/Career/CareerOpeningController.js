const CareerOpening = require('../../../models/CareerOpening');
const DepartmentMaster = require('../../../models/DepartmentMaster');
const DesignationMaster = require('../../../models/DesignationMaster');
const HospitalMaster = require('../../../models/HospitalMaster');
const CareerMaster = require('../../../models/CareerMaster');

async function generateAutoIncrementedId() {
    // Find the document with the highest _id
    const lastCareerMaster = await CareerOpening.findOne({}, { _id: 1 })
        .sort({ _id: -1 })
        .lean();

    return lastCareerMaster ? lastCareerMaster._id + 1 : 1;
}
const CareerOpeningForm = async (req, res) => {
    try {
        const {
            HospitalName,
            DepartmentName,
            Designation,
            StartDate,
            EndDate,
            Opening,
            IsActive
        } = req.body;

        if (!HospitalName || !DepartmentName || !Designation) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const _id = await generateAutoIncrementedId();

        const hospital = await HospitalMaster.findOne({ HospitalName: HospitalName });
        if (!hospital) {
            return res.status(404).json({ error: "Hospital not found" });
        }
        const hospitalId = hospital._id;

        const departments = await DepartmentMaster.find({ DepartmentName: DepartmentName });
        if (!departments || departments.length === 0) {
            return res.status(404).json({ error: "Department not found" });
        }

        let DepartmentID;
        for (let department of departments) {
            if (department.HospitalID === hospitalId && department.DepartmentName === DepartmentName) {
                DepartmentID = department._id;
                break;
            }
        }
        if (!DepartmentID) {
            return res.status(404).json({ error: "Department not found for the specified hospital" });
        }

        const designation = await DesignationMaster.findOne({ Designation: Designation });
        if (!designation) {
            return res.status(404).json({ error: "Designation not found" });
        }
        const designationId = designation._id;

        const careerOpening = new CareerOpening({
            _id: _id,
            DepartmentID: DepartmentID,
            DesignationID: designationId,
            StartDate: StartDate || date.now(),
            EndDate: EndDate || date.now(),
            Opening,
            IsActive: IsActive || true
        });

        await careerOpening.save();
        res.status(201).json({
            message: "Career Opening created successfully",
            data: careerOpening
        });
    } catch (error) {
        console.error('❌ Error in creating CareerOpening', error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};

const FilterDepartments = async (req, res) => {

    const { HospitalName } = req.body;

    if (!HospitalName) {
        return res.status(400).json({ error: "Missing HospitalName field" });
    }

    const _id = await generateAutoIncrementedId();

    const hospital = await HospitalMaster.findOne({ HospitalName: HospitalName });
    if (!hospital) {
        return res.status(404).json({ error: "Hospital not found" });
    }
    const hospitalId = hospital._id;
    const departments = await DepartmentMaster.find({ HospitalID: hospitalId });

    res.status(200).json({
        message: "Departments fetched successfully",
        count: departments.length,
        data: departments.map((department) => ({
            DepartmentName: department.DepartmentName,
            HospitalID: department.HospitalID
        }))
    });

};

const getAllCareerOpening = async (req, res) => {
    try {
        let careerOpenings = await CareerOpening.find({});

        if (careerOpenings.length == 0) {
            return res.status(404).json({
                success: false,
                message: "No Career Openings found"
            });
        }

        for (let careerOpening of careerOpenings) {
            const department = await DepartmentMaster.findById(careerOpening.DepartmentID);
            if (department) {
                careerOpening.DepartmentName = department.DepartmentName;

                // Get hospital information using department's HospitalID
                const hospital = await HospitalMaster.findById(department.HospitalID);
                if (hospital) {
                    careerOpening.HospitalName = hospital.HospitalName;
                }
            }

            const designation = await DesignationMaster.findById(careerOpening.DesignationID);
            if (designation) {
                careerOpening.DesignationName = designation.Designation;
            }
        }

        res.status(200).json({
            success: true,
            message: "Career Openings fetched successfully",
            count: careerOpenings.length,
            data: careerOpenings.map((careerOpening) => ({
                _id: careerOpening._id,
                HospitalName: careerOpening.HospitalName,
                DepartmentName: careerOpening.DepartmentName,
                DesignationName: careerOpening.DesignationName,
                StartDate: careerOpening.StartDate,
                EndDate: careerOpening.EndDate,
                Opening: careerOpening.Opening,
                IsActive: careerOpening.IsActive
            }))
        });
    } catch (error) {
        console.error('❌ Error in getting CareerOpening', error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};

const searchCareerOpening = async (req, res) => {
    try {
        const { HospitalName, DepartmentName, Designation } = req.body;

        let careerOpenings = await CareerOpening.find({});
        let searchedCareerOpenings = [];

        for (let careerOpening of careerOpenings) {
            const department = await DepartmentMaster.findById(careerOpening.DepartmentID);
            let hospitalName = null;
            let departmentName = null;

            if (department) {
                departmentName = department.DepartmentName;

                const hospital = await HospitalMaster.findById(department.HospitalID);
                if (hospital) {
                    hospitalName = hospital.HospitalName;
                }
            }

            const designation = await DesignationMaster.findById(careerOpening.DesignationID);
            let designationName = null;

            if (designation) {
                designationName = designation.Designation;
            }

            let matchesSearch = true;

            if (HospitalName && hospitalName) {
                matchesSearch = matchesSearch && hospitalName.toLowerCase().includes(HospitalName.toLowerCase());
            }

            if (DepartmentName && departmentName) {
                matchesSearch = matchesSearch && departmentName.toLowerCase().includes(DepartmentName.toLowerCase());
            }

            if (Designation && designationName) {
                matchesSearch = matchesSearch && designationName.toLowerCase().includes(Designation.toLowerCase());
            }

            if (matchesSearch) {
                searchedCareerOpenings.push({
                    HospitalName: hospitalName,
                    DepartmentName: departmentName,
                    Designation: designationName,
                    StartDate: careerOpening.StartDate,
                    EndDate: careerOpening.EndDate,
                    Opening: careerOpening.Opening,
                    IsActive: careerOpening.IsActive
                });
            }
        }

        res.json({
            success: true,
            message: "Career Openings fetched successfully",
            count: searchedCareerOpenings.length,
            data: searchedCareerOpenings
        });

    } catch (error) {
        console.log("❌ Error in getting searched CareerOpening:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

const deleteCareerOpening = async (req, res) => {
    const careerOpening = await CareerOpening.findById(req.params.id);
    if (!careerOpening) {
        return res.status(404).json({
            success: false,
            message: "Career Opening not found"
        });
    }
    await careerOpening.deleteOne();
    res.status(200).json({
        success: true,
        message: "Career Opening deleted successfully"
    });
};

const editCareerOpening = async (req, res) => {
    try {
        const userId = req.user.userId || req.user.adminId;
        const careerOpeningId = req.params.id;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID not found in token"
            });
        }

        const {
            HospitalName,
            DepartmentName,
            Designation,
            StartDate,
            EndDate,
            Opening,
            IsActive
        } = req.body;

        const existingCareerOpening = await CareerOpening.findById(careerOpeningId);
        if (!existingCareerOpening) {
            return res.status(404).json({
                success: false,
                message: "Career Opening not found"
            });
        }

        // Validate required fields
        if (!HospitalName || !DepartmentName || !Designation) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: HospitalName, DepartmentName, and Designation are required"
            });
        }

        // Find Hospital
        const hospital = await HospitalMaster.findOne({ HospitalName: HospitalName });
        if (!hospital) {
            return res.status(404).json({
                success: false,
                message: "Hospital not found"
            });
        }
        const hospitalId = hospital._id;

        // Find Department for the specific hospital
        const departments = await DepartmentMaster.find({ DepartmentName: DepartmentName });
        if (!departments || departments.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Department not found"
            });
        }

        let DepartmentID;
        for (let department of departments) {
            if (department.HospitalID.toString() === hospitalId.toString() && department.DepartmentName === DepartmentName) {
                DepartmentID = department._id;
                break;
            }
        }

        if (!DepartmentID) {
            return res.status(404).json({
                success: false,
                message: "Department not found for the specified hospital"
            });
        }

        // Find Designation
        const designation = await DesignationMaster.findOne({ Designation: Designation });
        if (!designation) {
            return res.status(404).json({
                success: false,
                message: "Designation not found"
            });
        }
        const designationId = designation._id;

        const updateData = {
            DepartmentID: DepartmentID,
            DesignationID: designationId,
            Opening: Opening,
            IsActive: IsActive !== undefined ? IsActive : existingCareerOpening.IsActive
        };

        if (StartDate) {
            updateData.StartDate = StartDate;
        }
        if (EndDate) {
            updateData.EndDate = EndDate;
        }

        const updatedCareerOpening = await CareerOpening.findByIdAndUpdate(
            careerOpeningId,
            updateData,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: "Career Opening updated successfully",
            data: updatedCareerOpening
        });

    } catch (error) {
        console.error('❌ Error in editing CareerOpening:', error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

const getCareerInquiry = async (req, res) => {
    try {
        const userId = req.user.userId || req.user.adminId;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID not found in token"
            });
        }

        const careerInquiries = await CareerMaster.find({});

        if (careerInquiries.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No Career Inquiry Found",
            });
        }

        const enrichedCareerInquiries = [];

        for(let careerInquiry of careerInquiries) {
            let enrichedInquiry = {
                _id: careerInquiry._id,
                FullName: careerInquiry.FullName,
                Gender: careerInquiry.Gender,
                MobileNo: '+' + careerInquiry.CountryCode + careerInquiry.MobileNo,
                EmailID: careerInquiry.EmailID,
                Qualification: careerInquiry.Qualification,
                TotalExperience: careerInquiry.TotalExperience,
                Remarks: careerInquiry.Remarks,
                IsRead: careerInquiry.IsRead,
                FilePath: careerInquiry.FilePath,
            };

            if(careerInquiry.CareerOpeningID) {
                const careerOpening = await CareerOpening.findById(careerInquiry.CareerOpeningID);
                if(careerOpening)
                {
                    enrichedInquiry.Openings = careerOpening.Opening;
                    enrichedInquiry.StartDate = careerOpening.StartDate;
                    enrichedInquiry.EndDate = careerOpening.EndDate;
                    enrichedInquiry.IsActive = careerOpening.IsActive;

                    const department = await DepartmentMaster.findById(careerOpening.DepartmentID);
                    if(department)
                    {
                        enrichedInquiry.DepartmentName = department.DepartmentName;

                        const hospital = await HospitalMaster.findById(department.HospitalID);
                        if(hospital)
                        {
                            enrichedInquiry.HospitalName = hospital.HospitalName;
                        }
                    }
                    const designation = await DesignationMaster.findById(careerOpening.DesignationID);
                    if(designation)
                    {
                        enrichedInquiry.Designation = designation.Designation;
                    }
                }
            }
            else
            {
                if(careerInquiry.DepartmentID)
                {
                    const department = await DepartmentMaster.findById(careerInquiry.DepartmentID);
                    if(department)
                    {
                        enrichedInquiry.DepartmentName = department.DepartmentName;

                        const hospital = await HospitalMaster.findById(department.HospitalID);
                        if(hospital)
                        {
                            enrichedInquiry.HospitalName = hospital.HospitalName;
                        }
                    }
                }
                if(careerInquiry.DesignationID)
                {
                    const designation = await DesignationMaster.findById(careerInquiry.DesignationID);
                    if(designation)
                    {
                        enrichedInquiry.Designation = designation.Designation;
                    }
                }
            }

            let isInclude = true;
            if(enrichedInquiry.StartDate && enrichedInquiry.EndDate)
            {
                const currentDate = new Date();
                const startDate = new Date(enrichedInquiry.StartDate);
                const endDate = new Date(enrichedInquiry.EndDate);

                const isDateWithinRange = currentDate >= startDate && currentDate <= endDate;
                const isActive = enrichedInquiry.IsActive === true;

                isInclude = isDateWithinRange && isActive;
            }
            if(isInclude)
            {
                enrichedCareerInquiries.push(enrichedInquiry);
            }       
        } 
        res.status(200).json({
            success: true,
            message: "Career Inquiry fetched successfully",
            count: enrichedCareerInquiries.length,
            data: enrichedCareerInquiries
        })
    } catch (error) {
        console.error('❌ Error in getting CareerInquiry:', error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

const searchCareerInquiry = async (req, res) => {
    try {
        const userId = req.user.userId || req.user.adminId;
        const { HospitalName, DepartmentName } = req.body;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID not found in token"
            });
        }

        const careerInquiries = await CareerMaster.find({});

        if (careerInquiries.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No Career Inquiry Found",
                data: []
            });
        }

        const enrichedCareerInquiries = [];

        for (let careerInquiry of careerInquiries) {
            let enrichedInquiry = {
                _id: careerInquiry._id,
                FullName: careerInquiry.FullName,
                Gender: careerInquiry.Gender,
                MobileNo: '+' + careerInquiry.CountryCode + careerInquiry.MobileNo,
                EmailID: careerInquiry.EmailID,
                Qualification: careerInquiry.Qualification,
                TotalExperience: careerInquiry.TotalExperience,
                Remarks: careerInquiry.Remarks,
                IsRead: careerInquiry.IsRead,
                FilePath: careerInquiry.FilePath,
            };

            if (careerInquiry.CareerOpeningID) {
                const careerOpening = await CareerOpening.findById(careerInquiry.CareerOpeningID);
                if (careerOpening) {
                    enrichedInquiry.Openings = careerOpening.Opening;
                    enrichedInquiry.StartDate = careerOpening.StartDate;
                    enrichedInquiry.EndDate = careerOpening.EndDate;
                    enrichedInquiry.IsActive = careerOpening.IsActive;

                    // Get department info
                    const department = await DepartmentMaster.findById(careerOpening.DepartmentID);
                    if (department) {
                        enrichedInquiry.DepartmentName = department.DepartmentName;

                        // Get hospital info
                        const hospital = await HospitalMaster.findById(department.HospitalID);
                        if (hospital) {
                            enrichedInquiry.HospitalName = hospital.HospitalName;
                        }
                    }

                    // Get designation info
                    const designation = await DesignationMaster.findById(careerOpening.DesignationID);
                    if (designation) {
                        enrichedInquiry.Designation = designation.Designation;
                    }
                }
            } else {
                // Handle direct department/designation references
                if (careerInquiry.DepartmentID) {
                    const department = await DepartmentMaster.findById(careerInquiry.DepartmentID);
                    if (department) {
                        enrichedInquiry.DepartmentName = department.DepartmentName;

                        const hospital = await HospitalMaster.findById(department.HospitalID);
                        if (hospital) {
                            enrichedInquiry.HospitalName = hospital.HospitalName;
                        }
                    }
                }

                if (careerInquiry.DesignationID) {
                    const designation = await DesignationMaster.findById(careerInquiry.DesignationID);
                    if (designation) {
                        enrichedInquiry.Designation = designation.Designation;
                    }
                }
            }

            let shouldInclude = true;

            if (HospitalName || DepartmentName) {
                shouldInclude = true; 

                if (HospitalName && DepartmentName) {
                    shouldInclude = (enrichedInquiry.HospitalName === HospitalName) && 
                                   (enrichedInquiry.DepartmentName === DepartmentName);
                }
                else if (HospitalName && !DepartmentName) {
                    shouldInclude = enrichedInquiry.HospitalName === HospitalName;
                }
                else if (!HospitalName && DepartmentName) {
                    shouldInclude = enrichedInquiry.DepartmentName === DepartmentName;
                }
            }

            if (shouldInclude && enrichedInquiry.StartDate && enrichedInquiry.EndDate) {
                const currentDate = Date.now();
                const isWithinDateRange = currentDate >= new Date(enrichedInquiry.StartDate).getTime() && 
                                        currentDate <= new Date(enrichedInquiry.EndDate).getTime();
                const isActive = enrichedInquiry.IsActive === true;
                
                if (!isWithinDateRange || !isActive) {
                    shouldInclude = false;
                }
            }

            if (shouldInclude) {
                enrichedCareerInquiries.push(enrichedInquiry);
            }
        }

        res.status(200).json({
            success: true,
            message: "Career Inquiry fetched successfully",
            count: enrichedCareerInquiries.length,
            data: enrichedCareerInquiries
        });

    } catch (error) {
        console.error('❌ Error in getting CareerInquiry:', error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

module.exports = {
    CareerOpeningForm,
    FilterDepartments,
    getAllCareerOpening,
    searchCareerOpening,
    deleteCareerOpening,
    editCareerOpening,
    getCareerInquiry,
    searchCareerInquiry
};