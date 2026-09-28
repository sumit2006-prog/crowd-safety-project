const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/crowd_safe', {
      serverSelectionTimeoutMS: 2000 // Fast fail so fallback mode can activate gracefully
    });
    console.log(`[MongoDB] Connected: ${conn.connection.host}`);
    return true;
  } catch (err) {
    console.warn(`[MongoDB] Connection skipped/unavailable: ${err.message}. Running in API Memory Mode.`);
    return false;
  }
};

module.exports = connectDB;
