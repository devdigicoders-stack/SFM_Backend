const mongoose = require('mongoose');

let isMongoConnected = false;

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/sfm_facility_db';
  
  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
    });
    isMongoConnected = true;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    isMongoConnected = false;
    console.warn(`ℹ️ MongoDB connection notice: ${error.message}.`);
  }
};

const isConnected = () => {
  return mongoose.connection && mongoose.connection.readyState === 1;
};

const getDBStatus = () => ({
  connected: isConnected(),
  type: isConnected() ? 'MongoDB Live Cluster' : 'Persistent File-Backed Collections Store'
});

module.exports = { connectDB, getDBStatus, isConnected };

