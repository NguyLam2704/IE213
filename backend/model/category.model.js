const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    category_id: { type: Number, required: true, unique: true },
    category_name: { type: String, required: true }
});

module.exports = mongoose.model('Admin', CategorySchema);