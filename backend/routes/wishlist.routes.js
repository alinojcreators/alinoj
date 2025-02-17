const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth.middleware');
const Wishlist = require('../models/wishlist.model');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

// Get wishlist items for user
router.get('/', auth, async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ userId: req.user._id })
      .populate({
        path: 'items',
        select: 'name description price image rating reviews'
      });
    
    if (!wishlist) {
      return res.json([]);
    }

    res.json(wishlist.items);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching wishlist', error: error.message });
  }
});

// Get shared wishlist by code
router.get('/shared/:shareCode', async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ 
      shareCode: req.params.shareCode,
      isPublic: true 
    }).populate({
      path: 'items',
      select: 'name description price image rating reviews'
    });
    
    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching shared wishlist', error: error.message });
  }
});

// Share wishlist with others
router.post('/share', auth, async (req, res) => {
  try {
    const { emails, accessLevel } = req.body;
    
    let wishlist = await Wishlist.findOne({ userId: req.user._id });
    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    // Make wishlist public and add share code if not already set
    wishlist.isPublic = true;
    if (!wishlist.shareCode) {
      wishlist.shareCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    }

    // Add emails to sharedWith array
    if (emails && Array.isArray(emails)) {
      emails.forEach(email => {
        if (!wishlist.sharedWith.find(share => share.email === email)) {
          wishlist.sharedWith.push({ email, accessLevel: accessLevel || 'view' });
        }
      });
    }

    await wishlist.save();
    res.json({ shareCode: wishlist.shareCode, sharedWith: wishlist.sharedWith });
  } catch (error) {
    res.status(500).json({ message: 'Error sharing wishlist', error: error.message });
  }
});

// Transfer items to cart
router.post('/transfer-to-cart', auth, async (req, res) => {
  try {
    const { items } = req.body;
    const wishlist = await Wishlist.findOne({ userId: req.user._id });
    
    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    // Validate items
    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ message: 'Invalid items array' });
    }

    // Convert item IDs to ObjectIds and validate
    const validItems = items
      .filter(id => mongoose.Types.ObjectId.isValid(id))
      .map(id => new ObjectId(id));

    if (validItems.length === 0) {
      return res.status(400).json({ message: 'No valid items to transfer' });
    }

    // Remove transferred items from wishlist
    wishlist.items = wishlist.items.filter(item => 
      !validItems.some(validItem => validItem.equals(item))
    );
    
    await wishlist.save();
    
    res.json({ 
      message: 'Items transferred to cart successfully',
      remainingItems: await Wishlist.findById(wishlist._id).populate({
        path: 'items',
        select: 'name description price image rating reviews'
      })
    });
  } catch (error) {
    res.status(500).json({ message: 'Error transferring items to cart', error: error.message });
  }
});

// Add item to wishlist
router.post('/add', auth, async (req, res) => {
  try {
    const { productId } = req.body;
    
    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    let wishlist = await Wishlist.findOne({ userId: req.user._id });
    
    if (!wishlist) {
      wishlist = new Wishlist({
        userId: req.user._id,
        items: [new ObjectId(productId)]
      });
    } else if (!wishlist.items.includes(productId)) {
      wishlist.items.push(new ObjectId(productId));
    }
    
    wishlist.updatedAt = Date.now();
    await wishlist.save();
    
    const updatedWishlist = await Wishlist.findById(wishlist._id)
      .populate({
        path: 'items',
        select: 'name description price image rating reviews'
      });
    
    res.json(updatedWishlist.items);
  } catch (error) {
    res.status(500).json({ message: 'Error adding to wishlist', error: error.message });
  }
});

// Remove item from wishlist
router.delete('/remove/:productId', auth, async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    const wishlist = await Wishlist.findOne({ userId: req.user._id });
    
    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }
    
    // Convert productId to ObjectId for comparison and filter
    const productObjectId = new ObjectId(productId);
    wishlist.items = wishlist.items.filter(item => 
      !item.equals(productObjectId)
    );
    
    wishlist.updatedAt = Date.now();
    await wishlist.save();
    
    const updatedWishlist = await Wishlist.findById(wishlist._id)
      .populate({
        path: 'items',
        select: 'name description price image rating reviews'
      });
    
    res.json(updatedWishlist.items);
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    res.status(500).json({ message: 'Error removing from wishlist', error: error.message });
  }
});

module.exports = router;