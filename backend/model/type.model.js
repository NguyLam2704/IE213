const mongoose = require('mongoose');

const TypeSchema = new mongoose.Schema({
    type_id: { type: Number, required: true, unique: true },
    type_name: { type: String, required: true }
});

module.exports = mongoose.model('Admin', TypeSchema);