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
    'https://frontend-ldtg0ds9v-subashini-ss-projects.vercel.app',
    'http://localhost:3000'
  ],
  credentials: true
}));

// Routes
app.use('/api/events', require('./src/routes/events'));
app.use('/api/goals', require('./src/routes/goals'));
app.use('/api/tasks', require('./src/routes/tasks'));

// Home route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Calendar API' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  // server.close(() => process.exit(1));
});