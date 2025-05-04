/**
 * Main server file for the Tone Slider Text Tool backend.
 * This file sets up the Express server, middleware, and routes
 * for handling text tone adjustment requests.
 */
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const config = require('./config/config');
const toneRoutes = require('./routes/toneRoutes');
const { createClient } = require('redis');

/**
 * Load environment variables from .env file
 */
dotenv.config();

/**
 * Create Express application instance
 */
const app = express();

/**
 * Configure middleware
 * - CORS for cross-origin requests
 * - JSON body parsing
 */
app.use(cors({
    origin: '*', // Allow all origins in development
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());


const client = createClient ({
  url : process.env.REDIS_URL,
});

client.on("error", function(err) {
  throw err;
});
client.connect();

/**
 * Import and use routes
 */
app.use('/api/tone', toneRoutes);

/**
 * Error handling middleware
 * @param {Error} err - Error object
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 */
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

/**
 * Start the server
 * @param {number} PORT - Server port number
 */
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 