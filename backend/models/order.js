const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    status: {
        type: String,
        enum: ['PENDING', 'PAID', 'FULFILLED', 'CANCELLED'],
        default: 'PENDING'
    },
    trackingStage: String,
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' }
});

module.exports = mongoose.model('Order', orderSchema);
