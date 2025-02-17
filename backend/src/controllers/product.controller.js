const Product = require('../models/product');
const fs = require('fs').promises;
const path = require('path');

exports.getProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      tags,
      brands,
      sortBy,
      sortOrder,
      page = 1,
      pageSize = 12
    } = req.query;

    // Build query
    const query = {};

    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    // Category filter
    if (category) {
      query.category = category.toLowerCase();
    }

    // Price range
    if (minPrice || maxPrice) {
      query.sellingPrice = {};
      if (minPrice) query.sellingPrice.$gte = Number(minPrice);
      if (maxPrice) query.sellingPrice.$lte = Number(maxPrice);
    }

    // Tags filter
    if (tags) {
      query.tags = { $in: tags.split(',') };
    }

    // Brands filter
    if (brands) {
      query.brand = { $in: brands.split(',') };
    }

    // Build sort options
    let sort = {};
    if (sortBy) {
      switch (sortBy) {
        case 'price':
          sort.sellingPrice = sortOrder === 'desc' ? -1 : 1;
          break;
        case 'rating':
          sort.rating = -1;
          break;
        case 'newest':
          sort.createdAt = -1;
          break;
        default:
          sort.createdAt = -1;
      }
    }

    // Execute query with pagination
    const skip = (Number(page) - 1) * Number(pageSize);
    const [products, total] = await Promise.all([
      Product.find(query)
        .sort(sort)
        .skip(skip)
        .limit(Number(pageSize)),
      Product.countDocuments(query)
    ]);

    // Transform products to include image URL from media
    const transformedProducts = products.map(product => {
      const productObj = product.toObject();
      if (productObj.media && productObj.media.length > 0) {
        const primaryImage = productObj.media.find(m => m.isPrimary) || productObj.media[0];
        productObj.image = primaryImage.url;
      }
      console.log('Transformed product:', productObj);
      return productObj;
    });

    res.json({
      items: transformedProducts,
      total,
      page: Number(page),
      pageSize: Number(pageSize),
      totalPages: Math.ceil(total / Number(pageSize))
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getBrands = async (req, res) => {
  try {
    const brands = await Product.distinct('brand');
    res.json(brands);
  } catch (error) {
    console.error('Error fetching brands:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getTags = async (req, res) => {
  try {
    const tags = await Product.distinct('tags');
    res.json(tags);
  } catch (error) {
    console.error('Error fetching tags:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const productData = JSON.parse(JSON.stringify(req.body));
    console.log('Received product data:', productData);
    
    // Handle file upload
    if (req.file) {
      const imagePath = `/uploads/products/${req.file.filename}`;
      // Create media entry for the uploaded image
      productData.media = [{
        type: 'image',
        url: imagePath,
        alt: productData.name,
        isPrimary: true
      }];
      console.log('Added media:', productData.media);
    }

    // Convert string values to appropriate types
    productData.costPrice = Number(productData.costPrice);
    productData.sellingPrice = Number(productData.sellingPrice);
    productData.taxRate = Number(productData.taxRate);
    productData.stock = Number(productData.stock);
    productData.reorderLevel = Number(productData.reorderLevel);
    productData.onSale = productData.onSale === 'true';
    productData.hasVariants = false; // Force to false for now
    
    // Remove id if it's 'null'
    if (productData.id === 'null') {
      delete productData.id;
    }
    
    // Validate SKU
    if (!productData.sku || typeof productData.sku !== 'string' || !productData.sku.trim()) {
      throw new Error('Invalid SKU provided');
    }

    // Check if SKU already exists
    const existingProduct = await Product.findOne({ 
      $or: [
        { sku: productData.sku.trim() },
        { 
          hasVariants: true,
          variants: {
            $elemMatch: {
              sku: productData.sku.trim()
            }
          }
        }
      ]
    });
    
    if (existingProduct) {
      console.log('Found existing product:', existingProduct);
      throw new Error('SKU already exists');
    }

    // Handle tags
    if (productData.tags) {
      try {
        productData.tags = JSON.parse(productData.tags);
      } catch (e) {
        productData.tags = productData.tags.split(',').map(tag => tag.trim());
      }
    }

    // Handle variants - explicitly set to empty array when hasVariants is false
    productData.variants = undefined; // Set to undefined instead of empty array

    // Handle SEO data
    if (productData.seo) {
      productData.seo = JSON.parse(productData.seo);
      if (!productData.seo.slug && productData.name) {
        productData.seo.slug = productData.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
      }
    } else {
      delete productData.seo;
    }

    // Create the product
    const product = new Product(productData);
    await product.save();
    
    // Transform the response
    const transformedProduct = product.toObject();
    if (transformedProduct.media && transformedProduct.media.length > 0) {
      transformedProduct.image = transformedProduct.media[0].url;
    }
    
    console.log('Created product:', transformedProduct);
    res.status(201).json(transformedProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    
    // Clean up uploaded file if there was an error
    if (req.file) {
      const filePath = path.join(__dirname, '../../', req.file.path);
      try {
        await fs.unlink(filePath);
        console.log('Cleaned up uploaded file:', filePath);
      } catch (unlinkError) {
        console.error('Error cleaning up file:', unlinkError);
      }
    }
    
    res.status(400).json({ 
      message: error.message || 'Error creating product',
      error: error.toString()
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const productData = JSON.parse(JSON.stringify(req.body));
    
    // Validate SKU
    if (!productData.sku || typeof productData.sku !== 'string' || !productData.sku.trim()) {
      throw new Error('Invalid SKU provided');
    }

    // Check if SKU already exists (excluding current product)
    const existingProduct = await Product.findOne({
      $or: [
        { sku: productData.sku.trim() },
        { 
          hasVariants: true,
          variants: {
            $elemMatch: {
              sku: productData.sku.trim()
            }
          }
        }
      ],
      _id: { $ne: req.params.id }
    });
    
    if (existingProduct) {
      console.log('Found existing product:', existingProduct);
      throw new Error('SKU already exists');
    }

    // Handle tags
    if (productData.tags) {
      productData.tags = JSON.parse(productData.tags);
    }

    // Handle variants - explicitly set to empty array when hasVariants is false
    productData.hasVariants = false;
    productData.variants = [];

    // Handle SEO data
    if (productData.seo) {
      productData.seo = JSON.parse(productData.seo);
      if (!productData.seo.slug && productData.name) {
        productData.seo.slug = productData.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
      }
    } else {
      delete productData.seo;
    }

    // Handle file upload
    if (req.file) {
      productData.media = [{
        type: 'image',
        url: `/uploads/products/${req.file.filename}`,
        alt: productData.name,
        isPrimary: true
      }];
      
      // Delete old image if it exists
      const oldProduct = await Product.findById(req.params.id);
      if (oldProduct && oldProduct.media && oldProduct.media.length > 0) {
        const oldImagePath = path.join(__dirname, '../../', oldProduct.media[0].url);
        await fs.unlink(oldImagePath).catch(console.error);
      }
    }

    console.log('Final product data before update:', productData);
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      productData,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    
    if (req.file) {
      await fs.unlink(req.file.path).catch(console.error);
    }
    
    // Handle specific error types
    if (error.code === 11000) {
      console.error('Duplicate key error details:', error);
      return res.status(400).json({ 
        message: error.message.includes('variants.sku') ? 
          'Variant SKU already exists' : 
          'SKU already exists'
      });
    }
    
    res.status(400).json({ message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ 
      message: 'Error deleting product', 
      error: error.message 
    });
  }
};