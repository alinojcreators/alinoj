const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const upload = require('../middleware/upload.middleware');
const { auth } = require('../../middleware/auth.middleware'); // Fixed path to root middleware folder
const mongoose = require('mongoose');
const Product = mongoose.model('Product'); // Use existing model instead of requiring it again

router.get('/', productController.getProducts);
router.post('/', upload.single('image'), productController.createProduct);
router.get('/brands', productController.getBrands);
router.get('/tags', productController.getTags);
router.get('/:id', productController.getProductById);
router.put('/:id', upload.single('image'), productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

// Rate and review a product
router.post('/:id/rate', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment, images } = req.body;
    const userId = req.user._id;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Invalid rating. Must be between 1 and 5' });
    }

    // First ensure product exists
    let product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Initialize userRatings if it doesn't exist
    if (!Array.isArray(product.userRatings)) {
      product.userRatings = [];
      product.reviews = 0;
      product.rating = 0;
      await product.save();
    }

    // Check if user has already rated
    const existingRatingIndex = product.userRatings.findIndex(r => 
      r.userId.toString() === userId.toString()
    );

    if (existingRatingIndex !== -1) {
      // Update existing rating
      product.userRatings[existingRatingIndex] = {
        ...product.userRatings[existingRatingIndex],
        rating,
        comment: comment || product.userRatings[existingRatingIndex].comment,
        images: images || product.userRatings[existingRatingIndex].images,
        updatedAt: new Date()
      };
    } else {
      // Add new rating
      product.userRatings.push({
        userId,
        rating,
        comment,
        images: images || [],
        createdAt: new Date()
      });
    }

    // Get unique users who have rated
    const uniqueUserIds = new Set(
      product.userRatings.map(r => r.userId.toString())
    );

    // Update review count based on unique users
    product.reviews = uniqueUserIds.size;

    // Calculate new average rating
    const totalRating = product.userRatings.reduce((sum, r) => sum + r.rating, 0);
    product.rating = Number((totalRating / product.reviews).toFixed(1));

    // Save all changes
    await product.save();

    // Populate user details for the response
    const populatedProduct = await Product.findById(id)
      .populate({
        path: 'userRatings.userId',
        select: 'name email avatar'
      });

    // Log for debugging
    console.log('Product after rating:', {
      id: populatedProduct._id,
      totalRatings: populatedProduct.userRatings.length,
      uniqueUsers: uniqueUserIds.size,
      reviews: populatedProduct.reviews,
      rating: populatedProduct.rating,
      lastRating: rating,
      lastUserId: userId
    });

    res.json(populatedProduct);
  } catch (error) {
    console.error('Rating error:', error);
    res.status(500).json({ 
      message: 'Error rating product', 
      error: error.message 
    });
  }
});

module.exports = router;