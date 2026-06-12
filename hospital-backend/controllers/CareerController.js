const CareerOpening = require('../models/CareerOpening');
const DesignationMaster = require('../models/DesignationMaster');
const DepartmentMaster = require('../models/DepartmentMaster');
const HospitalMaster = require('../models/HospitalMaster');

exports.getCareerOpenings = async (req, res) => {
    try {
        const todayIST = new Date();
        todayIST.setHours(todayIST.getHours() + 5.5); 
        todayIST.setHours(0, 0, 0, 0);

        const careerOpenings = await CareerOpening.find({ IsActive: true });

        const toDeactivateIds = [];

        for (const opening of careerOpenings) {
            if (opening.EndDate) {
                const endDateIST = new Date(opening.EndDate);
                endDateIST.setHours(0, 0, 0, 0);

                if (todayIST > endDateIST) {
                    toDeactivateIds.push(opening._id);
                }
            }
        }

        if (toDeactivateIds.length > 0) {
            await CareerOpening.updateMany(
                { _id: { $in: toDeactivateIds } },
                { $set: { IsActive: false } }
            );
        }

        const activeCareerOpenings = await CareerOpening.find({ IsActive: true });

        const careersFlat = await Promise.all(activeCareerOpenings.map(async (opening) => {
            const designation = await DesignationMaster.findOne({ _id: opening.DesignationID });
            const department = await DepartmentMaster.findOne({ _id: opening.DepartmentID });
            let hospital = null;
            if (department && department.HospitalID != null) {
                hospital = await HospitalMaster.findOne({ _id: department.HospitalID });
            }

            const endDate = opening.EndDate
                ? opening.EndDate.toLocaleDateString('en-GB')
                : 'N/A';

            return {
                CareerOpeningID: opening._id,
                DepartmentID: department?._id || null,
                DesignationID: designation?._id || null,
                HospitalID: hospital?._id || null,
                DepartmentName: department?.DepartmentName || 'N/A',
                HospitalName: hospital?.HospitalName || 'N/A',
                Designation: designation?.Designation || 'N/A',
                EndDate: endDate
            };
        }));

        const grouped = {};
        for (const item of careersFlat) {
            if (!grouped[item.DepartmentName]) {
                grouped[item.DepartmentName] = [];
            }
            grouped[item.DepartmentName].push({
                CareerOpeningID: item.CareerOpeningID,
                DepartmentID: item.DepartmentID,
                DesignationID: item.DesignationID,
                HospitalID: item.HospitalID,
                HospitalName: item.HospitalName,
                Designation: item.Designation,
                EndDate: item.EndDate
            });
        }

        const result = Object.keys(grouped).map(dept => ({
            DepartmentName: dept,
            Openings: grouped[dept]
        }));

        res.json({ Careers: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};
