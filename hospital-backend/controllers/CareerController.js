const CareerOpening = require('../models/CareerOpening');
const DesignationMaster = require('../models/DesignationMaster');
const DepartmentMaster = require('../models/DepartmentMaster');
const HospitalMaster = require('../models/HospitalMaster');

exports.getCareerOpenings = async (req, res) => {
    try {
        // Get today's date in IST (Indian Standard Time), set hours/minutes/seconds to 0 for date-only comparison
        const todayIST = new Date();
        todayIST.setHours(todayIST.getHours() + 5.5); // Convert UTC to IST
        todayIST.setHours(0, 0, 0, 0);

        // Find all active career openings
        const careerOpenings = await CareerOpening.find({ IsActive: true });

        // Track IDs to deactivate
        const toDeactivateIds = [];

        // Check for expired openings and collect their IDs
        for (const opening of careerOpenings) {
            if (opening.EndDate) {
                // Set time to 0 for date-only comparison
                const endDateIST = new Date(opening.EndDate);
                endDateIST.setHours(0, 0, 0, 0);

                if (todayIST > endDateIST) {
                    toDeactivateIds.push(opening._id);
                }
            }
        }

        // Deactivate expired openings in bulk
        if (toDeactivateIds.length > 0) {
            await CareerOpening.updateMany(
                { _id: { $in: toDeactivateIds } },
                { $set: { IsActive: false } }
            );
        }

        // Fetch active openings again after deactivation
        const activeCareerOpenings = await CareerOpening.find({ IsActive: true });

        // Build the flat careers array as before, now including IDs
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

        // Group by DepartmentName
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

        // Transform into desired array format
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
