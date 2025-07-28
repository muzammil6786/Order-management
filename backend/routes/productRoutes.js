const express = require('express');
const router = express.Router();
const { createProduct, getProducts } = require('../controller/productController');

router.post('/', createProduct);   // POST /api/products
router.get('/', getProducts);      // GET /api/products

module.exports = router;
