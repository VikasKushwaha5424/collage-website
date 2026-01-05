const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');

router.post('/request', requestController.raiseRequest);
router.get('/data', requestController.getDashboardData);
router.post('/approve', requestController.approveRequest);

module.exports = router;