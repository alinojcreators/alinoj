const mongoose = require('mongoose');
const User = require('../src/models/User');
require('dotenv').config();

const verifySuperAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const superAdmin = await User.findOne({ 
      email: process.env.SUPERADMIN_EMAIL,
      role: 'superadmin' 
    });

    if (superAdmin) {
      console.log('Superadmin Found:', {
        id: superAdmin._id,
        name: superAdmin.name,
        email: superAdmin.email,
        role: superAdmin.role
      });
    } else {
      console.log('No superadmin found with the specified email');
    }

    await mongoose.connection.close();
  } catch (error) {
    console.error('Verification Error:', error);
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  }
};

verifySuperAdmin();
