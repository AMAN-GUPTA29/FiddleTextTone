/**
 * Controller for handling tone adjustment operations
 * This file contains the business logic for text tone manipulation
 */
const { adjustTone } = require('../models/mistralModel');
const { redisUtil, redisUtilGet } = require('../utils/redis');

/**
 * Handle tone adjustment request
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 */
const adjustToneHandler = async (req, res, next) => {
    try {
        const { text, toneLevel, styleLevel } = req.body;
        
        /**
         * Validate request parameters
         */
        if (!text || typeof text !== 'string') {
            return res.status(400).json({ error: 'Invalid text input' });
        }

        if (toneLevel === undefined || styleLevel === undefined) {
            return res.status(400).json({ error: 'Missing tone or style level' });
        }

        // Validate ranges
        if (toneLevel < 0 || toneLevel > 100 || styleLevel < 0 || styleLevel > 100) {
            return res.status(400).json({ error: 'Tone and style levels must be between 0 and 100' });
        }

        // Create a unique cache key
        const cacheKey = `tone:${text}:${toneLevel}:${styleLevel}`;

        // Check cache first
        const cachedResponse = await redisUtilGet(cacheKey);
        if (cachedResponse) {
            return res.json({ adjustedText: cachedResponse });
        }

        /**
         * Process the text adjustment
         */
        const adjustedText = await adjustTone(text, toneLevel, styleLevel);
        
        // Cache the response
        await redisUtil(cacheKey, adjustedText);
        
        /**
         * Return the adjusted text
         */
        res.json({
            adjustedText,
            originalText: text,
            toneLevel,
            styleLevel
        });
    } catch (error) {
        console.error('Error in tone adjustment:', error);
        next(error);
    }
};

module.exports = {
    adjustTone: adjustToneHandler
}; 