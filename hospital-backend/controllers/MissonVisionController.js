const MissonVision = require("../models/MissonVision");

const getAllMissonVision = async(req, res) =>{
    try{
        const MissonVisions = await MissonVision.find({});

        if(MissonVisions.length == 0)
        {
            return res.status(404).json({
                success: false,
                message: "No Misson Vision found"
            });
        }
        res.status(200).json({
            success: true,
            count: MissonVisions.length,
            data: MissonVisions
        });
    }
    catch{
        console.error("❌ Error in getAllMissonVision:", error); 
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

module.exports = { getAllMissonVision };