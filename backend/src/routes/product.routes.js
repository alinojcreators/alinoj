const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const upload = require('../middleware/upload.middleware');

router.get('/', productController.getProducts);
router.post('/', upload.single('image'), productController.createProduct);
router.get('/brands', productController.getBrands);
router.get('/tags', productController.getTags);
router.get('/:id', productController.getProductById);
router.put('/:id', upload.single('image'), productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;