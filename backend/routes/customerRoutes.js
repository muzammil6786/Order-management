const express = require('express');
const router = express.Router();
const { createCustomer, getCustomers } = require('../controller/customerController');

router.post('/', createCustomer);      // POST /api/customers
router.get('/', getCustomers);         // GET /api/customers

module.exports = router;
