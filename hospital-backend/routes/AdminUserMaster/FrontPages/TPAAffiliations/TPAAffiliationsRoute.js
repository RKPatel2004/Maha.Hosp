const express = require("express");
const router = express.Router();
const { CreateTPAAffiliation,
    getAllTPAAffiliations,
    UpdateTPAAffiliation,
    deleteTPAAffiliation,
    searchTPAAffiliation
 } = require("../../../../controllers/AdminUserMaster/FrontPages/TPAAffiliations/TPAAffiliationsController");
const authenticateToken = require("../../../../middleware/authenticateToken");
const { TPAAffiliationsUpload } = require("../../../../middleware/upload");

router.post("/create-tpa-affiliation", authenticateToken, TPAAffiliationsUpload.single('Logo') , CreateTPAAffiliation);
router.get("/get-all-tpa-affiliations", authenticateToken, getAllTPAAffiliations);
router.put("/update-tpa-affiliation/:id", authenticateToken, TPAAffiliationsUpload.single('Logo'), UpdateTPAAffiliation);
router.delete("/delete-tpa-affiliation/:id", authenticateToken, deleteTPAAffiliation);
router.post("/search-tpa-affiliation", authenticateToken, searchTPAAffiliation);

module.exports = router;