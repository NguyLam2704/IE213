import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/database.js"; // Import file kết nối MongoDB
import userRoutes from "./routes/user.route.js"; // Đảm bảo đường dẫn đúng
import Authrouter from "./routes/auth.route.js";
import session from 'express-session';
import passport from "./config/passport.js";

dotenv.config();
const PORT = process.env.PORT || 5001;
connectDB();

const app = express();
// Khởi tạo Passport

app.use(
    session({
        secret: "a9b8c7d6e5f4g3h2i1", // Khóa bí mật để mã hóa session
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }, // false nếu không dùng HTTPS
    })
);
// Cấu hình session
app.use(passport.initialize());
app.use(passport.session());

// Middleware
app.use(express.json()); // Quan trọng để đọc dữ liệu JSON từ request
app.use(cors());
// Routes
app.use("/api/v1/users", userRoutes);
app.use('/api/auth', Authrouter);

// Route đăng nhập Google
app.get('/api/auth/google', 
    passport.authenticate("google", { scope: ["openid", "profile", "email"] })

);

// Route callback từ Google
app.get('/api/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        res.send(`🚀 Đăng nhập thành công! Chào ${req.user.displayName}`);
    }
);


// Test route
app.get("/", (req, res) => {
  res.send("Server is running!");
});


app.listen(PORT, () => console.log(`Server started at http://localhost:${PORT}`));

export default app;
