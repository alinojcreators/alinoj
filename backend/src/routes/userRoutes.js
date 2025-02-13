const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  updateUserRole, 
  getAllUsers,
  initSuperAdmin
} = require('../controllers/userController');
const { protect, adminProtect, superAdminProtect } = require('../middleware/authMiddleware');

// Logging middleware for routes
router.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/init-superadmin', initSuperAdmin);

// Logout route
router.post('/logout', (req, res) => {
  try {
    // In a stateless JWT system, logout is mostly client-side
    // You might want to add token blacklisting in a more complex implementation
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Error during logout' });
  }
});

// Protected routes
router.get('/', protect, adminProtect, getAllUsers);
router.patch('/:id/role', protect, superAdminProtect, updateUserRole);

// Global error handler for routes
router.use((err, req, res, next) => {
  console.error('Route Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Unexpected error in user routes',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

module.exports = router;
