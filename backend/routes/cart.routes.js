const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth.middleware');
const Cart = require('../models/cart.model');

// Get cart items for user
router.get('/', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id })
      .populate('items.productId');
    
    if (!cart) {
      return res.json({ items: [] });
    }

    const cartItems = cart.items.map(item => ({
      product: item.productId,
      quantity: item.quantity
    }));

    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cart', error: error.message });
  }
});

// Add item to cart
router.post('/add', auth, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    
    let cart = await Cart.findOne({ userId: req.user._id });
    
    if (!cart) {
      cart = new Cart({
        userId: req.user._id,
        items: [{ productId, quantity }]
      });
    } else {
      const existingItem = cart.items.find(item => 
        item.productId.toString() === productId.toString()
      );
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }
      
      cart.updatedAt = Date.now();
    }
    
    await cart.save();
    
    // Return updated cart with populated products
    const updatedCart = await Cart.findById(cart._id)
      .populate('items.productId');
    
    const cartItems = updatedCart.items.map(item => ({
      product: item.productId,
      quantity: item.quantity
    }));

    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ message: 'Error adding to cart', error: error.message });
  }
});

// Remove item from cart
router.delete('/remove/:productId', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    cart.items = cart.items.filter(item => 
      item.productId.toString() !== req.params.productId
    );
    cart.updatedAt = Date.now();
    
    await cart.save();
    
    const updatedCart = await Cart.findById(cart._id)
      .populate('items.productId');
    
    const cartItems = updatedCart.items.map(item => ({
      product: item.productId,
      quantity: item.quantity
    }));

    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ message: 'Error removing from cart', error: error.message });
  }
});

// Update cart item quantity
router.put('/update', auth, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    
    const cart = await Cart.findOne({ userId: req.user._id });
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    const item = cart.items.find(item => 
      item.productId.toString() === productId
    );
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }
    
    item.quantity = quantity;
    cart.updatedAt = Date.now();
    
    await cart.save();
    
    const updatedCart = await Cart.findById(cart._id)
      .populate('items.productId');
    
    const cartItems = updatedCart.items.map(item => ({
      product: item.productId,
      quantity: item.quantity
    }));

    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ message: 'Error updating cart', error: error.message });
  }
});

module.exports = router;