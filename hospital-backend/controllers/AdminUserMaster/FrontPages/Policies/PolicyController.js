const PrivatePolicy = require("../../../../models/PrivatePolicy");
const VisitorPolicy = require("../../../../models/VisitorPolicy");
const TermsCondition = require("../../../../models/TermsCondition");

const getPrivatePolicy = async (req, res) => {
    try {
        const userId = req.user.userId || req.user.adminId;
        if (!userId) {
            res.status(404).json({
                success: false,
                message: "User ID not found in token"
            });
        }
        const privatePolicy = await PrivatePolicy.find({});

        if (!privatePolicy) {
            return res.status(404).json({
                success: false,
                message: "Private policy not found"
            });
        }
        res.status(200).json({
            success: true,
            data: privatePolicy
        });
    } catch (error) {
        console.error("Error fetching private policy:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

const updatePrivatePolicy = async (req, res) => {
    try {
        const userId = req.user.userId || req.user.adminId;
        const { PrivatePolicyMessage } = req.body;

        if (!userId) {
            res.status(404).json({
                success: false,
                message: "User ID not found in token"
            });
        }

        const privatePolicy = await PrivatePolicy.findById(req.params.id);

        if (!privatePolicy) {
            return res.status(404).json({
                success: false,
                message: "Private policy not found"
            });
        }

        const updatedprivatepolicy = {};

        if (PrivatePolicyMessage) updatedprivatepolicy.PrivatePolicyMessage = PrivatePolicyMessage.trim();

        await PrivatePolicy.findOneAndUpdate({ _id: parseInt(req.params.id) }, updatedprivatepolicy);

        res.status(200).json({
            success: true,
            message: "Private policy updated successfully"
        });
    } catch (error) {
        console.error("Error updating private policy:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

const getVisitorPolicy = async (req, res) => {
    try{
        const userId = req.user.userId || req.user.adminId;
        if (!userId) {
            res.status(404).json({
                success: false,
                message: "User ID not found in token"
            });
        }
        const visitorPolicy = await VisitorPolicy.find({});
        if(!visitorPolicy){
            return res.status(404).json({
                success: false,
                message: "Visitor policy not found"
            });
        }
        res.status(200).json({
            success: true,
            data: visitorPolicy
        });

    }catch(error){
        console.log("Error fetching visitor policy:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

const updateVisitorPolicy = async (req, res) => {
    try{
        const userId = req.user.userId || req.user.adminId;
        const { VisitorPolicyMessage } = req.body;

        if (!userId) {
            return res.status(404).json({
                success: false,
                message: "User ID not found in token"
            });
        }

        const visitorPolicy = await VisitorPolicy.findById(req.params.id);
        if(!visitorPolicy){
            return res.status(404).json({
                success: false,
                message: "Visitor policy not found"
            });
        }

        const updatedvisitorpolicy = {};

        if(VisitorPolicyMessage) updatedvisitorpolicy.VisitorPolicyMessage = VisitorPolicyMessage.trim();

        await VisitorPolicy.findOneAndUpdate({ _id: parseInt(req.params.id)}, updatedvisitorpolicy);

        return res.status(200).json({
            success: true,
            message: "Visitor policy updated successfully"
        });

    }catch(error){
        console.log("Error updating visitor policy:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};


const getTermsCondition = async (req, res) => {
    try{
        const userId = req.user.userId || req.user.adminId;
        if (!userId) {
            res.status(404).json({
                success: false,
                message: "User ID not found in token"
            });
        }
        const termsCondition = await TermsCondition.find({});
        if(!termsCondition){
            return res.status(404).json({
                success: false,
                message: "Terms and conditions not found"
            });
        }
        res.status(200).json({
            success: true,
            data: termsCondition
        });
    }catch(error){
        console.log("Error fetching terms and conditions:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

const updateTermsCondition = async (req, res) => {
    const userId = req.user.userId || req.user.adminId;
    const { TermsConditionMessage } = req.body;

    if (!userId) {
        return res.status(404).json({
            success: false,
            message: "User ID not found in token"
        });
    }

    const termsCondition = await TermsCondition.findById(req.params.id);
    if(!termsCondition){
        return res.status(404).json({
            success: false,
            message: "Terms and conditions not found"
        });
    }

    const updatedtermscondition = {};

    if(TermsConditionMessage) updatedtermscondition.TermsConditionMessage = TermsConditionMessage.trim();

    await TermsCondition.findOneAndUpdate({ _id: parseInt(req.params.id)}, updatedtermscondition);

    return res.status(200).json({
        success: true,
        message: "Terms and conditions updated successfully"
    });
};

module.exports = { 
    getPrivatePolicy, 
    updatePrivatePolicy, 
    getVisitorPolicy, 
    updateVisitorPolicy,
    getTermsCondition,
    updateTermsCondition 
};