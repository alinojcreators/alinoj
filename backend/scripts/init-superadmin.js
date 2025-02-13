const mongoose = require('mongoose');
const User = require('../src/models/User');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: 'e:\\alinoj\\backend\\.env' });

const initSuperAdmin = async () => {
  try {
    // Log environment variables for debugging
    console.log('Environment Variables:');
    console.log('MONGODB_URI:', process.env.MONGODB_URI);
    console.log('SUPERADMIN_EMAIL:', process.env.SUPERADMIN_EMAIL);
    console.log('SUPERADMIN_NAME:', process.env.SUPERADMIN_NAME);
    console.log('SUPERADMIN_PASSWORD:', process.env.SUPERADMIN_PASSWORD ? '[REDACTED]' : 'NOT SET');

    // Validate required environment variables
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not set in .env file');
    }
    if (!process.env.SUPERADMIN_EMAIL) {
      throw new Error('SUPERADMIN_EMAIL is not set in .env file');
    }
    if (!process.env.SUPERADMIN_PASSWORD) {
      throw new Error('SUPERADMIN_PASSWORD is not set in .env file');
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');

    // Delete existing superadmin to force recreation
    const deletedUser = await User.findOneAndDelete({ 
      email: process.env.SUPERADMIN_EMAIL,
      role: 'superadmin' 
    });

    if (deletedUser) {
      console.log('Existing superadmin deleted:', {
        id: deletedUser._id,
        name: deletedUser.name,
        email: deletedUser.email
      });
    }

    // Create superadmin user directly
    const superAdmin = new User({
      name: process.env.SUPERADMIN_NAME,
      email: process.env.SUPERADMIN_EMAIL,
      password: process.env.SUPERADMIN_PASSWORD,  // Let pre-save hook hash the password
      role: 'superadmin'
    });

    const savedUser = await superAdmin.save();
    console.log('Superadmin created successfully:', {
      id: savedUser._id,
      name: savedUser.name,
      email: savedUser.email,
      role: savedUser.role
    });

    // Close the connection
    await mongoose.connection.close();
  } catch (error) {
    console.error('Superadmin initialization FATAL ERROR:', error);
    process.exit(1);
  }
};

initSuperAdmin();
