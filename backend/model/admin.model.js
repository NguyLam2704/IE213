const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
    admin_id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone_number: { type: String }
});

module.exports = mongoose.model('Admin', AdminSchema);
