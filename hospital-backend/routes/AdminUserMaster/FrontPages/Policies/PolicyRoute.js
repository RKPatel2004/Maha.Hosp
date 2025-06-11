const express = require("express");
const router = express.Router();
const { getPrivatePolicy, 
    updatePrivatePolicy,
    getVisitorPolicy,
    updateVisitorPolicy,
    getTermsCondition,
    updateTermsCondition } = require("../../../../controllers/AdminUserMaster/FrontPages/Policies/PolicyController");
const authenticateToken = require("../../../../middleware/authenticateToken");

router.get("/get-private-policy", authenticateToken, getPrivatePolicy);
router.put("/update-private-policy/:id", authenticateToken, updatePrivatePolicy);

router.get("/get-visitor-policy", authenticateToken, getVisitorPolicy);
router.put("/update-visitor-policy/:id", authenticateToken, updateVisitorPolicy);

router.get("/get-terms-condition", authenticateToken, getTermsCondition);
router.put("/update-terms-condition/:id", authenticateToken, updateTermsCondition);

module.exports = router;