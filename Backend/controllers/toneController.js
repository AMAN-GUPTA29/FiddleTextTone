const { adjustTone } = require('../models/mistralModel');
const { redisUtil, redisUtilGet } = require('../utils/redis');

const adjustToneHandler = async (req, res) => {
    try {
        const { text, toneLevel, styleLevel } = req.body;
        
        if (!text || toneLevel === undefined || styleLevel === undefined) {
            return res.status(400).json({ error: 'Text, tone level, and style level are required' });
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

        // If not in cache, get tone and style adjusted text from Mistral AI
        const adjustedText = await adjustTone(text, toneLevel, styleLevel);
        
        // Cache the response
        await redisUtil(cacheKey, adjustedText);
        
        res.json({ adjustedText });
    } catch (error) {
        console.error('Error adjusting tone:', error);
        res.status(500).json({ error: 'Failed to adjust tone and style' });
    }
};

module.exports = { adjustToneHandler }; 