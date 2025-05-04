const express = require('express');
const router = express.Router();
const { adjustToneHandler } = require('../controllers/toneController');

// Route for adjusting text tone
router.post('/adjust', adjustToneHandler);

module.exports = router; 