import express from "express";
import { register, login } from "../controllers/Auth.js";
import { getProfile } from "../controllers/User.js";
import authMiddleware from "../middleware/auth.js";

const userRouter = express.Router();

// Đăng ký
userRouter.post("/register", register);

// Đăng nhập
userRouter.post("/login", login);

// Lấy thông tin user
userRouter.get("/profile", getProfile);

export default userRouter;
