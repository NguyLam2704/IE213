const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    review_id: { type: Number, required: true, unique: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    prod_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    rating: { type: Number, required: true },
    comment: { type: String },
    approved: { type: Boolean, default: false }
});

module.exports = mongoose.model('Review', ReviewSchema);
