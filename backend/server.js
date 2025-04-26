import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/database.js"; // Import file kết nối MongoDB
import userRoutes from "./routes/user.route.js"; 
import Authrouter from "./routes/auth.route.js";
import session from 'express-session';
import passport from "./config/passport.js";
import productRoutes from "./routes/product.route.js"; 
import productImageRoutes from "./routes/productImage.route.js"; 
import categoryRoutes from "./routes/category.route.js"
import orderRoutes from "./routes/order.route.js";
import brandRoutes from "./routes/brand.route.js"
import cookieParser from 'cookie-parser';
import cartRouter from "./routes/cart.route.js";


dotenv.config();

const PORT = process.env.PORT || 5001;
connectDB();

const app = express();
app.use(express.json()); // Quan trọng để đọc dữ liệu JSON từ request
app.use(cookieParser());

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
app.use(cors());

// Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/productImages",productImageRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/order",orderRoutes)
app.use("/api/v1/brand", brandRoutes);
app.use('/api/auth', Authrouter);
app.use('/api/v1/cart', cartRouter);

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


// Cấu hình các Routes còn lại 
app.use('*',(req, res) => {
    res.status(404).json({error: "not found"})
});


app.listen(PORT, () => console.log(`Server started at http://localhost:${PORT}`));

export default app;
