import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js"; // Import file kết nối MongoDB
import userRoutes from "../routes/User.js"; // Đảm bảo đường dẫn đúng

dotenv.config();

connectDB();

const app = express();

// Middleware
app.use(express.json()); // Quan trọng để đọc dữ liệu JSON từ request
app.use(cors());

// Routes
app.use("/api/user", userRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Server is running!");
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server started at http://localhost:${PORT}`));

export default app;
