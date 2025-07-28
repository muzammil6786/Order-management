const Order = require('../models/order');
const Product = require('../models/product');
const Customer = require('../models/customer');
const { io } = require('../socket/index');

exports.placeOrder = async (req, res) => {
    try {
        const { customerId, items } = req.body;

        const productUpdates = [];

        for (const item of items) {
            const product = await Product.findById(item.product);
            if (!product || product.quantity < item.quantity) {
                return res.status(400).json({ message: 'Insufficient stock' });
            }
            product.quantity -= item.quantity;
            productUpdates.push(product.save());
        }

        await Promise.all(productUpdates);

        const order = await Order.create({ customer: customerId, items });
        // const order = await Order.findById(req.params.id).populate("customerId", "name email");


        io.emit('orderCreated', order); // WebSocket event

        res.status(201).json(order);
    } catch (err) {
        res.status(500).json({ message: 'Error placing order', error: err.message });
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('customer', 'name email')
            .populate('items.product', 'name price');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json(order);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching order', error: err.message });
    }
};

exports.updateOrderStatus = async (req, res) => {

    try {
        const { status } = req.body;
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        ).populate('customer');

        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Emit update event
        io.emit("order-status-updated", {
            orderId: updatedOrder._id,
            status: updatedOrder.status,
            trackingStage: updatedOrder.trackingStage,
            customer: updatedOrder.customer?.name || ''
        });

        res.json(updatedOrder);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to update status' });
    }

};


exports.updateTrackingStage = async (req, res) => {
    try {
        const { trackingStage } = req.body;
        const validStages = ['Placed', 'Picked', 'Shipped', 'Delivered'];

        if (!validStages.includes(trackingStage)) {
            return res.status(400).json({ message: `Invalid tracking stage. Allowed: ${validStages.join(', ')}` });
        }

        const order = await Order.findByIdAndUpdate(req.params.id, { trackingStage }, { new: true });
        if (!order) return res.status(404).json({ message: 'Order not found' });

        const { io } = require('../socket');
        io.emit('orderUpdated', order);

        res.json({ message: 'Tracking stage updated', order });
    } catch (err) {
        res.status(500).json({ message: 'Error updating tracking stage', error: err.message });
    }
};


////
exports.getAllOrders = async (req, res) => {
    try {
        const { status, trackingStage, customerId } = req.query;

        const query = {};
        if (status) query.status = status;
        if (trackingStage) query.trackingStage = trackingStage;
        if (customerId) query.customer = customerId;

        const orders = await Order.find(query)
            .populate('customer', 'name email')
            .populate('items.product', 'name price');

        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching orders', error: err.message });
    }
};

