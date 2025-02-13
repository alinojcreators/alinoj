const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('../middleware/asyncHandler');

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Register a new user
// @route   POST /api/users/register
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'user'
    });

    res.status(201).json({
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/users/login
exports.loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  console.log('Login Attempt:', {
    email,
    passwordProvided: password ? 'Yes' : 'No',
    passwordLength: password ? password.length : 0
  });

  // Validate input
  if (!email || !password) {
    console.warn(`Login attempt with missing credentials: ${email ? 'password missing' : 'email missing'}`);
    return res.status(400).json({ 
      message: 'Please provide email and password',
      details: 'Incomplete login credentials'
    });
  }

  // Find user by email, explicitly select password for comparison
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    console.warn(`Login attempt failed: No user found with email ${email}`);
    return res.status(401).json({ 
      message: 'Invalid email or password',
      details: 'User not found'
    });
  }

  // Log user details for debugging (excluding password)
  console.log('User Found:', {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    storedPasswordHash: user.password ? user.password.substring(0, 20) + '...' : 'No password'
  });

  try {
    // Detailed password comparison logging
    console.log('Password Comparison:', {
      providedPassword: password,
      storedPasswordHash: user.password
    });

    // Check password using bcrypt directly
    const isMatch = await bcrypt.compare(password, user.password);

    console.log('Password Comparison Result:', {
      isMatch,
      providedPasswordLength: password.length,
      storedHashLength: user.password.length
    });

    if (!isMatch) {
      console.warn(`Login attempt failed: Incorrect password for ${email}`);
      return res.status(401).json({ 
        message: 'Invalid email or password',
        details: 'Password mismatch'
      });
    }

    // Generate token
    const token = generateToken(user._id);

    // Return user info and token
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Internal server error during login',
      details: error.message 
    });
  }
});

// @desc    Update user role (Superadmin only)
// @route   PATCH /api/users/:id/role
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const userId = req.params.id;

    // Validate role
    if (!['user', 'admin', 'superadmin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(
      userId, 
      { role, updatedAt: Date.now() }, 
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all users (Admin and Superadmin)
// @route   GET /api/users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create initial superadmin
// @route   POST /api/users/init-superadmin
exports.initSuperAdmin = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Check if superadmin already exists
    const existingSuperAdmin = await User.findOne({ role: 'superadmin' });
    if (existingSuperAdmin) {
      return res.status(400).json({ message: 'Superadmin already exists' });
    }

    const superAdmin = await User.create({
      name: name || 'Superadmin',
      email,
      password,
      role: 'superadmin'
    });

    res.status(201).json({
      message: 'Superadmin created successfully',
      user: {
        id: superAdmin._id,
        name: superAdmin.name,
        email: superAdmin.email,
        role: superAdmin.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  registerUser: exports.registerUser,
  loginUser: exports.loginUser,
  updateUserRole: exports.updateUserRole,
  getAllUsers: exports.getAllUsers,
  initSuperAdmin: exports.initSuperAdmin
};
