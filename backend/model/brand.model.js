const mongoose = require('mongoose');

const BrandSchema = new mongoose.Schema({
    brand_id: { type: Number, required: true, unique: true },
    brand_name: { type: String, required: true }
});

module.exports = mongoose.model('Admin', BrandSchema);
