const BulletinMaster = require("../../../../models/BulletinMaster");

async function generateAutoIncrementedId() {
    const lastBulletin = await BulletinMaster.findOne({}, { _id: 1 })
        .sort({ _id: -1 })
        .lean();

    return lastBulletin ? lastBulletin._id + 1 : 1;
}

const createBulletin = async (req, res) => {
    try {
        const userId = req.user.userId || req.user.adminId;
        if (!userId) {
            res.status(404).json({
                success: false,
                message: "User ID not found in token"
            });
        }
        const { Title, Description, StartDate, EndDate, IsActive } = req.body;

        if (!Title) {
            return res.status(400).json({
                success: false,
                message: "Title is required"
            });
        }

        const newId = await generateAutoIncrementedId();

        let photoPath = "";
        if (req.file) {
            photoPath = req.file.path.replace(/\\/g, '/');
        }

        const newBulletin = new BulletinMaster({
            _id: newId,
            Title: Title.trim(),
            Description: Description.trim(),
            StartDate: new Date(StartDate),
            EndDate: new Date(EndDate),
            IsActive: IsActive === 'true' || IsActive === true,
            Photo: photoPath
        });

        const savedBulletin = await newBulletin.save();

        res.status(201).json({
            success: true,
            message: "Bulletin created successfully",
            data: savedBulletin
        });

    } catch (error) {
        console.error("Error creating bulletin:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

const getAllBulletins = async (req, res) => {
    try {
        const userId = req.user.userId || req.user.adminId;
        if (!userId) {
            res.status(404).json({
                success: false,
                message: "User ID not found in token"
            });
        }
        const bulletins = await BulletinMaster.find().sort({ _id: -1 });

        res.status(200).json({
            success: true,
            message: "Bulletins fetched successfully",
            data: bulletins.map(bulletin => ({
                _id: bulletin._id,
                Title: bulletin.Title,
                StartDate: bulletin.StartDate,
                EndDate: bulletin.EndDate,
                IsActive: bulletin.IsActive,
                Photo: bulletin.Photo
            }))
        });

    } catch (error) {
        console.error("Error fetching bulletins:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

const updateBulletin = async (req, res) => {
    try {
        const userId = req.user.userId || req.user.adminId;
        if (!userId) {
            res.status(404).json({
                success: false,
                message: "User ID not found in token"
            });
        }
        const { id } = req.params;
        const { Title, Description, StartDate, EndDate, IsActive } = req.body;

        const existingBulletin = await BulletinMaster.findOne({ _id: parseInt(id) });

        if (!existingBulletin) {
            return res.status(404).json({
                success: false,
                message: "Bulletin not found"
            });
        }

        const updateData = {};

        if (Title) updateData.Title = Title.trim();
        if (Description) updateData.Description = Description.trim();
        if (StartDate) updateData.StartDate = new Date(StartDate);
        if (EndDate) updateData.EndDate = new Date(EndDate);
        if (IsActive !== undefined) updateData.IsActive = IsActive === 'true' || IsActive === true;

        if (req.file) {
            updateData.Photo = req.file.path.replace(/\\/g, '/');
        }

        const updatedBulletin = await BulletinMaster.findOneAndUpdate(
            { _id: parseInt(id) },
            updateData,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: "Bulletin updated successfully",
            data: updatedBulletin
        });

    } catch (error) {
        console.error("Error updating bulletin:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

const deleteBulletin = async (req, res) => {
    try {
        const userId = req.user.userId || req.user.adminId;
        if (!userId) {
            res.status(404).json({
                success: false,
                message: "User ID not found in token"
            });
        }
        const { id } = req.params;

        const deletedBulletin = await BulletinMaster.findOneAndDelete({ _id: parseInt(id) });

        if (!deletedBulletin) {
            return res.status(404).json({
                success: false,
                message: "Bulletin not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Bulletin deleted successfully",
            data: deletedBulletin
        });

    } catch (error) {
        console.error("Error deleting bulletin:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

const searchBulletin = async (req, res) => {

    try {
        const userId = req.user.userId || req.user.adminId;

        const { Title } = req.body;
        if (!userId) {
            res.status(404).json({
                success: false,
                message: "User ID not found in token"
            });
        }

        const bulletins = await BulletinMaster.find({ Title: { $regex: Title, $options: 'i' } }).sort({ _id: -1 });

        if(bulletins.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Bulletins not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Bulletins searched successfully",
            data: bulletins.map(bulletin => ({
                _id: bulletin._id,
                Title: bulletin.Title,
                StartDate: bulletin.StartDate,
                EndDate: bulletin.EndDate,
                IsActive: bulletin.IsActive,
                Photo: bulletin.Photo
            }))
        });
    } catch (error) {
        console.error("Error searching bulletin:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};
module.exports = {
    createBulletin,
    getAllBulletins,
    updateBulletin,
    deleteBulletin,
    searchBulletin
};