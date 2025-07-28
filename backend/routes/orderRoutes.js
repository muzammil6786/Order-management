const express = require('express');
const router = express.Router();
const {
    placeOrder,
    getOrderById,
    updateOrderStatus,
    updateTrackingStage,
    getAllOrders
} = require('../controller/ordercontroller');

router.get('/:id', getOrderById);
router.patch('/:id/status', updateOrderStatus);
router.patch('/:id/trackingStage', updateTrackingStage);
router.get('/', getAllOrders);


router.post('/', placeOrder);

module.exports = router;
