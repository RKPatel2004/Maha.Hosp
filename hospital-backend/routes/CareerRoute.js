const express = require('express');
const router = express.Router();
const careerController = require('../controllers/CareerController');

router.get('/career', careerController.getCareerOpenings);

module.exports = router;
