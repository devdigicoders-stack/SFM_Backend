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

const getDBStatus = () => ({
  connected: isMongoConnected,
  type: isMongoConnected ? 'MongoDB Live Cluster' : 'Persistent File-Backed Collections Store'
});

const isConnected = () => isMongoConnected;

module.exports = { connectDB, getDBStatus, isConnected };

