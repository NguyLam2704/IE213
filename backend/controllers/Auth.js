import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

// Đăng ký
export const register = async (req, res) => {
    try {
        const { name, email, password, phone_number } = req.body;

        // Kiểm tra thiếu dữ liệu
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Kiểm tra email đã tồn tại
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }

        // Tạo user_id tự động
        const lastUser = await User.findOne().sort({ user_id: -1 });
        const newUserId = lastUser ? lastUser.user_id + 1 : 1;

        // Tạo user mới
        const newUser = new User({ 
            user_id: newUserId,
            name, 
            email, 
            password, 
            phone_number 
        });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully", user: newUser });
    } catch (error) {
        console.error(error); // Hiển thị lỗi chi tiết trong terminal
        res.status(500).json({ message: "Error registering user", error: error.message });
    }
};



// Đăng nhập
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Kiểm tra user có tồn tại không
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        // So sánh mật khẩu
        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        // Tạo token JWT
        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(200).json({ token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error });
    }
};
