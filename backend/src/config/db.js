const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    // Remove this line:
    // mongoose.set('maxPoolSize', 5);
    
    // Instead, add connection options directly to the connect method
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Connection timeouts to prevent hanging
      connectTimeoutMS: 5000,
      socketTimeoutMS: 6000
    });
    
    console.log(`MongoDB Connected`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;