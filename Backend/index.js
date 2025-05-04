const express = require('express');
const cors = require('cors');
const config = require('./config/config');
const toneRoutes = require('./routes/toneRoutes');
const { createClient } = require('redis');

const app = express();

// Middleware
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

// Routes
app.use('/api/tone', toneRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const PORT = 8000; // Fixed port number
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 