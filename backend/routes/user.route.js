import express from "express";
import { register, login } from "../controllers/Auth.js";
import { getProfile, fetchOneUser, fetchAllUsers, updateUsers, createUsers } from "../controllers/user.controller.js";
import authMiddleware from "../middleware/auth_token.js";

const userRouter = express.Router();

// Đăng ký
userRouter.post("/register", register);

// Đăng nhập
userRouter.post("/login", login);

// Lấy thông tin user
userRouter.get("/profile", authMiddleware, getProfile);
// or
userRouter.get("/:id", fetchOneUser)

// Lấy danh sách tất cả user
userRouter.get("/", fetchAllUsers) 

// Cập nhật thông tin user
userRouter.put("/:id", updateUsers)

userRouter.post("/", createUsers )
export default userRouter;
