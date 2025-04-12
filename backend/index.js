const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Enable CORS with updated configuration
app.use(cors({
  origin: [
    'https://frontend-ekjay3v53-subashini-ss-projects.vercel.app',
    'https://frontend-ldtg0ds9v-subashini-ss-projects.vercel.app',
    'https://frontend-orcin-eight-46.vercel.app', // Add this new URL
    'http://localhost:3000'
  ],
  credentials: true
}));

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Routes
app.use('/api/events', require('./src/routes/events'));
app.use('/api/goals', require('./src/routes/goals'));
app.use('/api/tasks', require('./src/routes/tasks'));

// Home route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Calendar API' });
});

// Add a global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

const PORT = process.env.PORT || 5000;

// For local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
});

// Export for Vercel serverless function
module.exports = app;