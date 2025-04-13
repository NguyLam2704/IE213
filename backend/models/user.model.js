import mongoose from 'mongoose';
import bcrypt from "bcrypt"; // Nếu dùng bcrypt
// import bcrypt from "bcryptjs"; // Nếu dùng bcryptjs

const UserSchema = new mongoose.Schema({
    user_id: { type: Number, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone_number: { type: String },
    status: { type: String },
    create_at: { type: Date, default: Date.now },
    update_at: { type: Date },
    refresh_token: { type: String },
});

// Băm mật khẩu trước khi lưu
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Phương thức check lại pass
UserSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};



const User = mongoose.model("User", UserSchema);
export default User;