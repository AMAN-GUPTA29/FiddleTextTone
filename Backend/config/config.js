require('dotenv').config();

module.exports = {
    port: process.env.PORT || 3000,
    mistralApiKey: process.env.MISTRAL_API_KEY,
}; 