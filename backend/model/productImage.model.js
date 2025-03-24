const mongoose = require('mongoose');

const ProductImageSchema = new mongoose.Schema({
    prod_image_id: { type: Number, required: true, unique: true },
    prod_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    image: { type: Buffer, required: true }, 
    is_primary_image: {type: Boolean, required: true},
});

module.exports = mongoose.model('Admin', ProductImageSchema);