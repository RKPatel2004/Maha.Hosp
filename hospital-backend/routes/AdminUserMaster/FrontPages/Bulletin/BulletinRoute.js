const express = require("express");
const { bulletinUpload } = require("../../../../middleware/upload");
const authenticateToken = require("../../../../middleware/authenticateToken");
const {
    createBulletin,
    getAllBulletins,
    updateBulletin,
    deleteBulletin,
    searchBulletin
} = require("../../../../controllers/AdminUserMaster/FrontPages/Bulletin/BulletinController");

const router = express.Router();

router.post("/create-bulletin", authenticateToken, bulletinUpload.single('Photo'), createBulletin);
router.get("/bulletins", authenticateToken, getAllBulletins);
router.put("/update-bulletin/:id", authenticateToken, bulletinUpload.single('Photo'), updateBulletin);
router.delete("/delete-bulletin/:id", authenticateToken, deleteBulletin);
router.post("/search-bulletin", authenticateToken, searchBulletin);

module.exports = router;