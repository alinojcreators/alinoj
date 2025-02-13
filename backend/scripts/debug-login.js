const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../src/models/User');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const debugLogin = async () => {
  const logFile = path.join(__dirname, 'debug-login.log');
  
  // Create a logging function that writes to both console and file
  const log = (message) => {
    console.log(message);
    fs.appendFileSync(logFile, message + '\n');
  };

  try {
    // Clear previous log
    if (fs.existsSync(logFile)) {
      fs.unlinkSync(logFile);
    }

    log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    log('MongoDB connected successfully');

    const email = process.env.SUPERADMIN_EMAIL;
    const password = process.env.SUPERADMIN_PASSWORD;

    log('Debug Login Inputs:');
    log(`Email: ${email}`);
    log(`Password Length: ${password ? password.length : 'N/A'}`);

    log(`Searching for user: ${email}`);
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      log('User not found');
      return;
    }

    log('User found:');
    log(`ID: ${user._id}`);
    log(`Name: ${user.name}`);
    log(`Email: ${user.email}`);
    log(`Role: ${user.role}`);

    // Verify password using bcrypt
    log('Attempting password verification...');
    log(`Stored Hashed Password: ${user.password}`);
    log(`Entered Password: ${password}`);

    // Generate a test hash to compare
    const testSalt = await bcrypt.genSalt(10);
    const testHash = await bcrypt.hash(password, testSalt);
    log(`Test Generated Hash: ${testHash}`);

    const isMatch = await bcrypt.compare(password, user.password);
    
    log(`Bcrypt Password match result: ${isMatch}`);

    mongoose.connection.close();
  } catch (error) {
    log(`Debug Login Error: ${error}`);
    if (mongoose.connection.readyState !== 0) {
      mongoose.connection.close();
    }
    process.exit(1);
  }
};

debugLogin();
