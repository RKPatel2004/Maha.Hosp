const BulletinMaster = require("../models/BulletinMaster");

const getAllBulletins = async(req, res) => {
    try {
        const bulletins = await BulletinMaster.find({});
        if(bulletins.length == 0) {
            return res.status(404).json({
                success: false,
                message: "No bulletins found"
            });
        }
        res.status(200).json({
            success: true,
            count: bulletins.length,
            data: bulletins
        });
    }
    catch(error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: "Error fetching bulletins"
        });
    }
};

const getRandomBulletins = async(req, res) => {
    try {
        const randomBulletins = await BulletinMaster.aggregate([
            { $match: { IsActive: true } },  
            { $sample: { size: 3 } }
        ]);
        
        if(randomBulletins.length == 0) {
            return res.status(404).json({
                success: false,
                message: "No bulletins found"
            });
        }
        
        res.status(200).json({
            success: true,
            count: randomBulletins.length,
            data: randomBulletins
        });
    }
    catch(error) {
        console.error("Error fetching random bulletins:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: "Error fetching random bulletins"
        });
    }
};

module.exports = { getAllBulletins, getRandomBulletins };