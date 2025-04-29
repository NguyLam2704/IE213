import express from "express";
import { fetchAllProducts, fetchProductById, createProduct } from "../controllers/product.controller.js";
import parser from '../utils/multer.js'

const productRouter = express.Router();

// Lấy thông tin 1 sản phẩm
productRouter.get("/:id", fetchProductById);

// Lấy danh sách tất cả sản phẩm
productRouter.get("/", fetchAllProducts);

// Thêm sản phẩm
productRouter.post("/", parser.single('image'), createProduct)
export default productRouter;