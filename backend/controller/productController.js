const Product = require('../models/product');

// Create new product
exports.createProduct = async (req, res) => {
    try {
        const { name, price, quantity } = req.body;

        // Check if product already exists
        const existing = await Product.findOne({ name });
        if (existing) {
            return res.status(400).json({ message: 'Product already exists' });
        }

        const product = await Product.create({ name, price, quantity });
        res.status(201).json(product);
    } catch (err) {
        res.status(500).json({ message: 'Error creating product', error: err.message });
    }
};

// Get all products
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching products', error: err.message });
    }
};
