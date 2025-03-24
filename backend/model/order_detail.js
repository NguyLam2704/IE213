const mongoose = require('mongoose');

const Order_DetailSchema = new mongoose.Schema({
    order_detail_id: { type: Number, required: true, unique: true },
    order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    prod_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
});

module.exports = mongoose.model('Admin', Order_DetailSchema);