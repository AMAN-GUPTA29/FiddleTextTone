/**
 * Routes for tone adjustment functionality
 * This file defines the API endpoints for text tone manipulation
 */
const express = require('express');
const router = express.Router();
const toneController = require('../controllers/toneController');

/**
 * POST /api/tone/adjust
 * Adjust the tone of the provided text based on the specified parameters
 * @route POST /api/tone/adjust
 * @param {string} text - The text to be adjusted
 * @param {number} toneLevel - The desired tone level (0-100)
 * @param {number} styleLevel - The desired style level (0-100)
 * @returns {Object} The adjusted text and metadata
 */
router.post('/adjust', toneController.adjustTone);

module.exports = router; 