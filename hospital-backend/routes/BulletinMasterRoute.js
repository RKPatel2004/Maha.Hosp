const express = require("express");
const router = express.Router();
const { getAllBulletins, getRandomBulletins } = require("../controllers/BulletinMasterController");

router.get("/bulletins", getAllBulletins);
router.get("/random-bulletins", getRandomBulletins);

module.exports = router;