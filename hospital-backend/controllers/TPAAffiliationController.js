const TPAAffiliation = require("../models/TPAAffiliation");

const getAllTPAAffiliation = async (req, res) => {
    try{
        const TPAAffiliations = await TPAAffiliation.find({});
        if(TPAAffiliations.length == 0){
            return res.status(404).json({
                success: false,
                message: "No TPA Affiliation found"
            });
        }
        res.status(200).json({
            success: true,
            count: TPAAffiliations.length,
            data: TPAAffiliations
        });
    }
    catch{
        res.status(500).json({
            success: false,
            message: "Server error",
            error: "Error fetching TPA Affiliation"
        });
    }
};

module.exports = { getAllTPAAffiliation };