const HospitalMaster = require("../../../../models/HospitalMaster");
const HealthPlanMaster = require("../../../../models/HealthPlanMaster");
const HealthPlanTypeMaster = require("../../../../models/HealthPlanTypeMaster");

const getAllHealthPlans = async (req, res) => {
    try {
        const userId = req.user.userId || req.user.adminId;
        if (!userId) {
            res.status(404).json({
                success: false,
                message: "User ID not found in token"
            });
        }

        const healthPlans = await HealthPlanMaster.find({});
        if(healthPlans.length == 0)
        {
            res.status(200).json({
                success: true,
                count: 0,
                message: "No health plans found"
            });
        }

        let enrichedHealthPlans = [];

        for(let healthPlan of healthPlans)
        {
            const enrichedHealthPlan = {
                _id: healthPlan._id,
                HealthPlanName: healthPlan.HealthPlanName,
                price: healthPlan.price,
                CoverImagePath: healthPlan.CoverImagePath,
                FilePath: healthPlan.FilePath,
                IsActive: healthPlan.IsActive,
            };

            hospital = await HospitalMaster.findById(healthPlan.HospitalID);
            if(!hospital)
            {
                return res.status(404).json({
                    success: false,
                    message: "Hospital not found"
                });
            }
            enrichedHealthPlan.HospitalName = hospital.HospitalName;

            const healthPlanType = await HealthPlanTypeMaster.findById(healthPlan.HealthPlanTypeID);
            if(!healthPlanType)
            {
                return res.status(404).json({
                    success: false,
                    message: "HealthPlanType not found"
                });
            }
            enrichedHealthPlan.HealthPlanType = healthPlanType.HealthPlanType;

            enrichedHealthPlans.push(enrichedHealthPlan);
        }

        res.status(200).json({
            success: true,
            count: enrichedHealthPlans.length,
            data: enrichedHealthPlans
        });
    } catch (error) {
        console.error(`Error getting all health plans: ${error.message}`);
        res.status(500).json({
            success: false,
            message: "Error getting all health plans"
        });
    }
};

const deleteHealthPlan = async (req, res) => {

    const userId = req.user.userId || req.user.adminId;
    if(!userId)
    {
        res.status(404).json({
            success: false,
            message: "User ID not found in token"
        });
    }

    const healthPlan = await HealthPlanMaster.findOne({ _id: req.params.id });
    if(!healthPlan)
    {
        return res.status(404).json({
            success: false,
            message: "Health plan not found"
        });
    }

    await healthPlan.deleteOne();

    res.status(200).json({
        success: true,
        message: "Health plan deleted successfully"
    });
};

const searchHealthPlan = async (req, res) => {
    try {
        const userId = req.user.userId || req.user.adminId;
        const {HospitalName, HealthPlanType, HealthPlanName} = req.body;
        if (!userId) {
            res.status(404).json({
                success: false,
                message: "User ID not found in token"
            });
        }

        const healthPlans = await HealthPlanMaster.find({});
        if(healthPlans.length == 0)
        {
            res.status(200).json({
                success: true,
                count: 0,
                message: "No health plans found"
            });
        }

        let enrichedHealthPlans = [];

        for(let healthPlan of healthPlans)
        {
            const enrichedHealthPlan = {
                _id: healthPlan._id,
                HealthPlanName: healthPlan.HealthPlanName,
                price: healthPlan.price,
                CoverImagePath: healthPlan.CoverImagePath,
                FilePath: healthPlan.FilePath,
                IsActive: healthPlan.IsActive,
            };

            hospital = await HospitalMaster.findById(healthPlan.HospitalID);
            if(!hospital)
            {
                return res.status(404).json({
                    success: false,
                    message: "Hospital not found"
                });
            }
            enrichedHealthPlan.HospitalName = hospital.HospitalName;

            const healthPlanType = await HealthPlanTypeMaster.findById(healthPlan.HealthPlanTypeID);
            if(!healthPlanType)
            {
                return res.status(404).json({
                    success: false,
                    message: "HealthPlanType not found"
                });
            }
            enrichedHealthPlan.HealthPlanType = healthPlanType.HealthPlanType;

            let isInclude = true;
            if(HospitalName || HealthPlanType || HealthPlanName)
            {
                isInclude = true;

                if(HospitalName && HealthPlanType && HealthPlanName)
                {
                    isInclude = hospital.HospitalName == HospitalName && healthPlanType.HealthPlanType == HealthPlanType && healthPlan.HealthPlanName == HealthPlanName;
                }
                else if(HospitalName && HealthPlanType && !HealthPlanName)
                {
                    isInclude = hospital.HospitalName == HospitalName && healthPlanType.HealthPlanType == HealthPlanType;
                }
                else if(HospitalName && !HealthPlanType && HealthPlanName)
                {
                    isInclude = hospital.HospitalName == HospitalName && healthPlan.HealthPlanName == HealthPlanName;
                }
                else if(HospitalName && !HealthPlanType && !HealthPlanName)
                {
                    isInclude = hospital.HospitalName == HospitalName;
                }
                else if(!HospitalName && HealthPlanType && HealthPlanName)
                {
                    isInclude = healthPlanType.HealthPlanType == HealthPlanType && healthPlan.HealthPlanName == HealthPlanName;
                }
                else if(!HospitalName && HealthPlanType && !HealthPlanName)
                {
                    isInclude = healthPlanType.HealthPlanType == HealthPlanType;
                }
                else if(!HospitalName && !HealthPlanType && HealthPlanName)
                {
                    isInclude = healthPlan.HealthPlanName == HealthPlanName;
                }
            }
            if(isInclude)
            {
                enrichedHealthPlans.push(enrichedHealthPlan);
            }
        }

        res.status(200).json({
            success: true,
            count: enrichedHealthPlans.length,
            data: enrichedHealthPlans
        });
    } catch (error) {
        console.error(`Error getting all health plans: ${error.message}`);
        res.status(500).json({
            success: false,
            message: "Error getting all health plans"
        });
    }
}

module.exports = { getAllHealthPlans, deleteHealthPlan, searchHealthPlan };