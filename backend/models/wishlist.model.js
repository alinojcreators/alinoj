const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  name: {
    type: String,
    default: 'My Wishlist'
  },
  items: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  shareCode: {
    type: String,
    unique: true,
    sparse: true
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  sharedWith: [{
    email: String,
    accessLevel: {
      type: String,
      enum: ['view', 'edit'],
      default: 'view'
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Generate a random share code before saving if the wishlist is public and doesn't have one
wishlistSchema.pre('save', function(next) {
  if (this.isPublic && !this.shareCode) {
    this.shareCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('Wishlist', wishlistSchema);