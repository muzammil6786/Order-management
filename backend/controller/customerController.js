const Customer = require('../models/customer');

// Create a new customer
exports.createCustomer = async (req, res) => {
    try {
        const { name, email } = req.body;
        // Check if customer with the same email already exists
        const existingCustomer = await Customer.findOne({ email });

        if (existingCustomer) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const customer = await Customer.create({ name, email });
        res.status(201).json(customer);
    } catch (err) {
        res.status(500).json({ message: 'Error creating customer', error: err.message });
    }
};

// Get all customers
exports.getCustomers = async (req, res) => {
    try {
        const customers = await Customer.find();
        res.status(200).json(customers);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching customers', error: err.message });
    }
};
