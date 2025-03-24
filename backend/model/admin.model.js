import mongoose from 'mongoose';

const AdminSchema = new mongoose.Schema({
    admin_id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone_number: { type: String }
});

const Admin = mongoose.model('Admin', AdminSchema);
export default Admin;
