const fetch = require('node-fetch');

const apiKey = process.env.MISTRAL_API_KEY;
const apiUrl = 'https://api.mistral.ai/v1/chat/completions';

const getTonePrompt = (toneLevel) => {
    if (toneLevel < 25) {
        return 'very formal and professional';
    } else if (toneLevel < 50) {
        return 'formal';
    } else if (toneLevel < 75) {
        return 'casual';
    } else {
        return 'very casual and conversational';
    }
};

const getStylePrompt = (styleLevel) => {
    if (styleLevel < 25) {
        return 'very concise and to the point';
    } else if (styleLevel < 50) {
        return 'concise';
    } else if (styleLevel < 75) {
        return 'expanded';
    } else {
        return 'very expanded and detailed';
    }
};

const adjustTone = async (text, toneLevel, styleLevel) => {
    try {
        const tonePrompt = getTonePrompt(toneLevel);
        const stylePrompt = getStylePrompt(styleLevel);
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'mistral-small',
                messages: [
                    {
                        role: 'system',
                        content: `You are a text tone and style adjuster. Adjust the following text to be more ${tonePrompt} and ${stylePrompt}. Keep the meaning the same but change the tone and style accordingly. do not reply it as a mail but just in a paragraph just give me the converted text to show as output in a paragraph do not add any extra text or explanation. Preserve the original meaning and content completely Return ONLY the transformed text without explanations, introductions, or metadata`,
                    },
                    {
                        role: 'user',
                        content: text
                    }
                ],
                temperature: 0.7
            })
        });

        if (!response.ok) {
            throw new Error(`Mistral API error: ${response.statusText}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('Mistral AI API error:', error);
        throw error;
    }
};

module.exports = { adjustTone }; 