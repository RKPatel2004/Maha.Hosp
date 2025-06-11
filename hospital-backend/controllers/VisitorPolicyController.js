const VistitorPolicy = require("../models/VisitorPolicy");

const getAllVisitorPolicies = async(req, res) =>{
    try{
        const VisitorPolicys = await VistitorPolicy.find({});
        
        if(VisitorPolicys.length==0)
        {
            return res.status(404).json({
                success: false,
                message: "No visitor policies found"
            });
        }
        res.status(200).json({
            success: true,
            count: VisitorPolicys.length,
            data: VisitorPolicys
        });
    }
    catch{
        res.status(500).json({
            success: false,
            message: "Server error",
            error: "error fetching visitor policies"
        });
    }
};

module.exports = {getAllVisitorPolicies};