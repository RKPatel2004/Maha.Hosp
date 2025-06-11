const TPAAffiliation = require("../../../../models/TPAAffiliation");

async function generateAutoIncrementedId() {
    const lastTPAAffiliation = await TPAAffiliation.findOne({}, { _id: 1}).sort({ _id: -1}).lean();

    return lastTPAAffiliation ? lastTPAAffiliation._id + 1 : 1;
} 

const CreateTPAAffiliation = async (req, res) => {
    const userId = req.user.userId || req.user.adminId;
    
    const { CompanyName } = req.body;
    if(!userId)
    {
        res.status(404).json({
            success: false,
            message: "User ID not found in token"
        });
    }

    if(!CompanyName)
    {
        return res.status(400).json({
            success: false,
            message: "Company name is required"
        });
    }

    const newId = await generateAutoIncrementedId();

    let logoPath = "";

    if(req.file)
    {
        logoPath = req.file.path.replace(/\\/g, '/');
    }

    const newTPAAffiliation = new TPAAffiliation({
        _id: newId,
        CompanyName: CompanyName.trim(),
        Logo: logoPath
    });

    await newTPAAffiliation.save();

    res.status(201).json({
        success: true,
        message: "TPA Affiliation created successfully",
        data: newTPAAffiliation
    });
};

const getAllTPAAffiliations = async (req, res) => {
    const userId = req.user.userId || req.user.adminId;

    if(!userId)
    {
        res.status(404).json({
            success: false,
            message: "User ID not found in token"
        });
    }

    const TPAAffiliations = await TPAAffiliation.find({});

    if(TPAAffiliations.length == 0)
    {
        res.status(404).json({
            success: false,
            message: "No TPA Affiliation found"
        });
    }

    res.status(200).json({
        success: true,
        count: TPAAffiliations.length,
        message: "TPA Affiliations fetched successfully",
        data: TPAAffiliations
    });
};

const UpdateTPAAffiliation = async (req, res) => {
    const userId = req.user.userId || req.user.adminId;
    
    const { CompanyName } = req.body;
    if(!userId)
    {
        res.status(404).json({
            success: false,
            message: "User ID not found in token"
        });
    }

    const { id } = req.params;

    const existingTPAAffiliation = await TPAAffiliation.findOne({ _id: parseInt(id) });
    if(!existingTPAAffiliation)
    {
        return res.status(404).json({
            success: false,
            message: "TPA Affiliation not found"
        });
    }

    const updateData = {};

    if(CompanyName) updateData.CompanyName = CompanyName.trim();

    if(req.file)
    {
        updateData.Logo = req.file.path.replace(/\\/g, '/');
    }

    const updatedTPAAffiliation = await TPAAffiliation.findOneAndUpdate(
        { _id: parseInt(id) },
        updateData, 
        {      
            new: true, 
            upsert: true,
            runValidators: true 
        }
    );

    res.status(200).json({
        success: true,
        message: "TPA Affiliation updated successfully",
        data: updatedTPAAffiliation
    });
};

const deleteTPAAffiliation = async (req, res) => {
    const userId = req.user.userId || req.user.adminId;
    
    if(!userId)
    {
        res.status(404).json({
            success: false,
            message: "User ID not found in token"
        });
    }

    await TPAAffiliation.findOneAndDelete({_id : req.params.id});

    res.status(200).json({
        success: true,
        message: "TPA Affiliation deleted successfully"
    });
};

const searchTPAAffiliation = async (req, res) => {
    const userId = req.user.userId || req.user.adminId;
    const { CompanyName } = req.body;
    if(!userId)
    {
        res.status(404).json({
            success: false,
            message: "User ID not found in token"
        });
    }

    const TPAAffiliations = await TPAAffiliation.find({CompanyName : { $regex: CompanyName, $options: 'i'}}).sort({ _id: -1 });

    if(TPAAffiliations.length == 0)
    {
        res.status(404).json({
            success: false,
            message: "No TPA Affiliation found"
        })
    }

    res.status(200).json({
        success: true,
        count: TPAAffiliations.length,
        message: "TPA Affiliations fetched successfully",
        data: TPAAffiliations
    });
};

module.exports = { CreateTPAAffiliation, 
    getAllTPAAffiliations, 
    UpdateTPAAffiliation, 
    deleteTPAAffiliation, 
    searchTPAAffiliation };