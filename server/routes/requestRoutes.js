const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');

router.get('/', requestController.getRequests);
router.post('/create', requestController.createRequest);
router.post('/update-status', requestController.updateStatus);

module.exports = router;