const WebFormMaster = require("../../../../models/WebFormMaster");
const UserWebFormRights = require("../../../../models/UserWebFormRights");
const UserTypeMaster = require("../../../../models/UserTypeMaster");
const UserMaster = require("../../../../models/UserMaster");

const searchUserRights = async (req, res) => {
    try {

        const userId = req.user.userId || req.user.adminId;
        const { UserType, UserName } = req.body;

        if(!userId)
        {
            return res.status(404).json({
                success: false,
                message: "User ID not found in token"
            });
        }
        const userType = await UserTypeMaster.findOne({ UserType: UserType });
        console.log(userType);
        if(!userType)
        {
            return res.status(404).json({
                success: false,
                message: "User Type not found"
            });
        }
        const userTypeId = userType._id;

        const user = await UserMaster.findOne({UserName: UserName, UserTypeID: userTypeId});
        console.log(user);
        if(!user)
        {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        const UserId = user._id;
        console.log(UserId);
        
        const forms = await UserWebFormRights.find({UserTypeID: userTypeId, UserID: UserId});
        if(forms.length === 0)
        {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        let enrichedWebFormRights = [];

        for(let form of forms)
        {
            const enrichedWebFormRight = {
                formId: null,
                formType: null,
                formName: null,
                Available: false
            };

            const formId = form.FormID;
            enrichedWebFormRight.formId = formId;
            const webFormMaster = await WebFormMaster.findOne({ _id: formId });
            if(!webFormMaster)
            {
                res.status(404).json({
                    success: false,
                    message: "Web Form Master not found"
                });
            }
            enrichedWebFormRight.formType = webFormMaster.FormType;
            enrichedWebFormRight.formName = webFormMaster.FormDisplayName;   
            enrichedWebFormRight.Available = webFormMaster.IsClose;   
            
            enrichedWebFormRights.push(enrichedWebFormRight);
        }

        return res.status(200).json({
            success: true,
            count: enrichedWebFormRights.length,
            data: enrichedWebFormRights.map(webFormRight => ({
                formId: webFormRight.formId,
                formType: webFormRight.formType,
                formName: webFormRight.formName,
                Available: webFormRight.Available
            }))
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ 
            sucess: false,
            message: error.message 
        });
    }
};

module.exports = { searchUserRights };