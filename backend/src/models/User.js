const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Check if model already exists to prevent redefinition
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    match: [
      /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
      'Please provide a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'superadmin'],
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Encrypt password before saving
UserSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to check password
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Static method to find user by email and compare password
UserSchema.statics.findAndComparePassword = async function(email, enteredPassword) {
  // Find user with password included
  const user = await this.findOne({ email }).select('+password');
  
  if (!user) {
    return null;
  }

  // Compare passwords
  const isMatch = await bcrypt.compare(enteredPassword, user.password);
  
  return isMatch ? user : null;
};

// Create the model, using mongoose.models to prevent redefinition
const User = mongoose.models.User || mongoose.model('User', UserSchema);

module.exports = User;
