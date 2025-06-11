const TermsCondition = require("../models/TermsCondition");

const getAllTermsConditions = async(req, res) =>{
    try{
        const TermsConditions = await TermsCondition.find({});

        if(TermsConditions.length==0)
        {
            return res.status(404).json({
                success: false,
                message: "No terms and conditions found"
            });
        }
        res.status(200).json({
            success: true,
            count: TermsConditions.length,
            data: TermsConditions
        });
    }
    catch{
        console.error("Error fetching terms and conditions:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

module.exports = {getAllTermsConditions};