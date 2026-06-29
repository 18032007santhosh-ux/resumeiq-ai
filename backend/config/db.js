const mongoose = require('mongoose');
// Load dotenv to ensure env variables are parsed if called standalone
require('dotenv').config();

const connectDB = async () => {
  const connUri = process.env.MONGO_URI || process.env.MONGODB_URI;

  if (!connUri) {
    console.error('❌ MongoDB Connection Error: MONGO_URI or MONGODB_URI is not defined in the environment variables.');
    process.exit(1);
  }

  // Mask password for safe logging
  const maskedUri = connUri.replace(/\/\/([^:]+):([^@]+)@/, '//xxxx:xxxx@');
  console.log(`⏳ Attempting to connect to MongoDB: ${maskedUri}`);

  try {
    const conn = await mongoose.connect(connUri);
    console.log(`🔌 MongoDB Connected Successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error('👉 Troubleshooting Tips:');
    console.error('   1. Check if your database server is running (e.g., local MongoDB service).');
    console.error('   2. Verify your IP address is whitelisted in MongoDB Atlas Network Security settings.');
    console.error('   3. Ensure special characters in your password are URL encoded (e.g., @ as %40).');
    console.error('   4. Confirm your MONGO_URI string is correctly formed.');
    process.exit(1);
  }
};

module.exports = connectDB;
