const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    user_id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone_number: { type: String },
    status: { type: String },
    create_at: { type: Date, default: Date.now },
    update_at: { type: Date }
});

module.exports = mongoose.model('User', UserSchema);
