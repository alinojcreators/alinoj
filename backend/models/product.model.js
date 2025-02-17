const mongoose = require('mongoose');
const path = require('path');

const productVariantSchema = new mongoose.Schema({
  sku: {
    type: String,
    required: false
  },
  size: String,
  color: String,
  material: String,
  weight: Number,
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
    unit: String
  },
  stock: {
    type: Number,
    required: true,
    min: 0
  },
  price: {
    type: Number,
    required: true,
    min: 0
  }
});

const productMediaSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['image', 'video'],
    required: true
  },
  url: {
    type: String,
    required: true
  },
  alt: String,
  isPrimary: {
    type: Boolean,
    default: false
  }
});

const productSpecificationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  }
});

const productShippingSchema = new mongoose.Schema({
  weight: {
    type: Number,
    required: true
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
    unit: String
  },
  class: {
    type: String,
    enum: ['free', 'standard', 'expedited'],
    required: true
  },
  locations: [{
    type: String
  }],
  cost: Number
});

const userRatingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    trim: true
  },
  images: [{
    url: String,
    caption: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const productSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    lowercase: true
  },
  subCategory: String,
  tags: [{
    type: String,
    trim: true
  }],
  sku: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    sparse: true,
    index: true,
    validate: {
      validator: function(v) {
        return typeof v === 'string' && v.length > 0;
      },
      message: 'SKU cannot be empty'
    }
  },

  // Pricing Information
  costPrice: {
    type: Number,
    required: true,
    min: 0
  },
  sellingPrice: {
    type: Number,
    required: true,
    min: 0
  },
  discount: {
    type: {
      type: String,
      enum: ['percentage', 'fixed']
    },
    value: Number,
    startDate: Date,
    endDate: Date
  },
  taxRate: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    required: true,
    default: 'USD'
  },
  onSale: {
    type: Boolean,
    default: false
  },

  // Inventory Information
  stock: {
    type: Number,
    required: true,
    min: 0
  },
  reorderLevel: {
    type: Number,
    required: true,
    min: 0
  },
  supplier: {
    id: String,
    name: String,
    code: String
  },

  // Variants
  hasVariants: {
    type: Boolean,
    default: false
  },
  variants: {
    type: [productVariantSchema],
    validate: {
      validator: function(v) {
        // If hasVariants is false, variants must be empty or undefined
        if (!this.hasVariants) {
          return !v || v.length === 0;
        }
        // When hasVariants is true, ensure each variant has required fields
        if (v && v.length > 0) {
          return v.every(variant => 
            variant.stock !== undefined && 
            variant.price !== undefined &&
            (variant.sku && variant.sku.trim())
          );
        }
        return true;
      },
      message: props => {
        if (!props.value || props.value.length === 0) {
          return 'Variants can only be added when hasVariants is true';
        }
        return 'All variants must have required fields when hasVariants is true';
      }
    }
  },

  // Media
  media: [productMediaSchema],

  // Specifications
  specifications: [productSpecificationSchema],
  warranty: {
    duration: Number,
    unit: {
      type: String,
      enum: ['days', 'months', 'years']
    },
    description: String
  },
  manufacturingDate: Date,
  expiryDate: Date,

  // SEO Information
  seo: {
    type: {
      metaTitle: String,
      metaDescription: String,
      metaKeywords: [String],
      slug: {
        type: String,
        trim: true
      }
    },
    default: undefined
  },

  // Shipping Information
  shipping: productShippingSchema,

  // Ratings & Reviews
  userRatings: {
    type: [userRatingSchema],
    default: [],
    validate: {
      validator: function(ratings) {
        // Check for unique userIds
        const userIds = ratings.map(r => r.userId.toString());
        const uniqueUserIds = new Set(userIds);
        return userIds.length === uniqueUserIds.size;
      },
      message: 'Each user can only rate once'
    }
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviews: {
    type: Number,
    default: 0,
    min: 0
  },
  reviewsData: [{
    id: String,
    rating: Number,
    comment: String,
    user: String,
    date: Date
  }],

  // Additional Information
  customFields: mongoose.Schema.Types.Mixed,
  certifications: [String],
  returnPolicy: String,
  relatedProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],

  // System Fields
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  createdBy: String,
  updatedBy: String
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      if (ret.media && ret.media.length > 0 && ret.media[0].url && !ret.media[0].url.startsWith('http') && !ret.media[0].url.startsWith('/uploads/')) {
        ret.media[0].url = `/uploads/products/${path.basename(ret.media[0].url)}`;
      }
      return ret;
    }
  }
});

// Drop all existing indexes except _id
productSchema.index({ name: 'text', description: 'text', brand: 'text', category: 'text', tags: 'text' });

// Add a compound index for SKU
productSchema.index({ sku: 1 }, { unique: true, sparse: true });

// Add a compound index for variants only when they exist
productSchema.index(
  { 'variants.sku': 1 },
  { 
    unique: true,
    sparse: true,
    partialFilterExpression: { 
      hasVariants: true,
      variants: { $exists: true, $ne: [] }
    }
  }
);

// Update the updatedAt field on save
productSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;