const MissonVision = require("../../../../models/MissonVision");

const getAllMissonVision = async (req, res) => {
    try {
        const userId = req.user.userId || req.user.adminId;

        if (!userId) {
            res.status(404).json({
                success: false,
                message: "User ID not found in token"
            });
        }

        const missonVision = await MissonVision.find(
            {},
            {
                _id: 0,
                __v: 0
            });

        if (missonVision.length == 0) {
            return res.status(404).json({
                success: false,
                message: "No Misson Vision found"
            });
        }
        res.status(200).json({
            success: true,
            count: missonVision.length,
            Misson: missonVision[0].Misson,
            Vision: missonVision[0].Vision
        });
    } catch (error) {
        console.error("❌ Error in getAllMissonVision:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

const updateMissonVision = async (req, res) => {
    try {
        const userId = req.user.userId || req.user.adminId;

        const { Misson, Vision } = req.body;
        if (!userId) {
            res.status(404).json({
                success: false,
                message: "User ID not found in token"
            });
        }

        const { id } = req.params;

        const missonVision = await MissonVision.find({ _id : parseInt(id)});

        if(!missonVision)
        {
            return res.status(404).json({
                success: false,
                message: "No Misson Vision found"
            });
        }

        const updateData = {};

        if(Misson) updateData.Misson = Misson.trim();
        if(Vision) updateData.Vision = Vision.trim();

        const updatedMissonVision = await MissonVision.findOneAndUpdate({ _id : parseInt(id)}, updateData);

        res.status(200).json({
            success: true,
            message: "Misson Vision updated successfully"
        });

    } catch (error) {
        console.error("❌ Error in updateMissonVision:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

module.exports = { getAllMissonVision, updateMissonVision };