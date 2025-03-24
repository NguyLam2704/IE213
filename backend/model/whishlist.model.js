const mongoose = require('mongoose');

const WishlistSchema = new mongoose.Schema({
    whishlist_id: { type: Number, required: true, unique: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    prod_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    create_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Admin', WishlistSchema);