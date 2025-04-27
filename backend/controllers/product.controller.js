import Product from '../models/product.model.js';
import Category from '../models/category.model.js';
import Brand from '../models/brand.model.js';
import ProductImage from '../models/productImage.model.js';
import Type from '../models/type.model.js'
import mongoose from 'mongoose';

export const fetchProductById = async (req, res) => {
    const productId = req.params.id; // lấy từ URL parameter
    try {
        const product = await Product.findOne({ _id: productId })
            .populate('category_id')
            .populate('brand_id')
            .populate('type_id')
            .populate({
                path:'images',
                select: 'image is_primary_image -prod_id',

            })

        if(!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        return res.status(200).json({success: true, data: product});
    } catch(e) {
        console.error("Error in fetching product:", e.message);
        return res.status(500).json({success: false, message: "Server Error"});
    }
}

export const fetchAllProducts = async (req, res) => {
    // Price Filter 
    const minPrice = parseInt(req.query.minPrice) || 0
    const maxPrice = parseInt(req.query.maxPrice) || Number.MAX_VALUE
    const priceFilter = (minPrice > 0 || maxPrice < Number.MAX_VALUE) ? { price: { $gte: minPrice, $lte: maxPrice } } : {};
    
    // Category Filter
    const category = (req.query.category) || ''
    const categoryFilter = (category) ? {'category_id':category } : {};

    // Brand Filter
    const brand = (req.query.brand) || ''
    const brandFilter = (brand) ? {brand_id: brand} : {}
    // Combine filters
    const query = { ...priceFilter, ...categoryFilter, ...brandFilter};
    // Pagination 
    const totalDocument = await Product.countDocuments(query);   //Tính tổng số sản phẩm
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || totalDocument;
    const skip = (page - 1) * limit 
    
    // Sorting
    const sort = req.query.sort || 'newest';
    let sortOption = {};
    switch(sort) {
        case 'newest':
            sortOption = { createdAt: -1 };  // Sort sản phẩm mới
            break;
        case 'best_selling':
            sortOption = {quantity_sold: -1}
            break;
        case 'price_asc':
            sortOption = { price: 1}  // Sort theo giá tăng dần
            break 
        case 'price_desc':
            sortOption = { price: -1} // Sort theo giá giảm dần 
            break
        default:
            sortOption = { createdAt: -1 }; 
    }

    try {
        const products = await Product.find(query)
            .populate('category_id')
            .populate('brand_id')
            .populate('type_id')
            .populate({
                path:'images',
                select: 'image is_primary_image -prod_id',
                match: {is_primary_image: true}
            })
            .sort(sortOption)
            .skip(skip)
            .limit(limit);  

        if(!products) {
            return res.status(404).json({ success: false, message: "Products not found" });
        }

        res.status(200).json({
            success: true, 
            page: page,
            totalPages: Math.ceil(totalDocument/limit), // Tổng số page 
            totalItems: totalDocument, // Tổng số sản phẩm  
            limit: limit, 
            data: products
        });
    } catch(e) {
        console.error("Error in fetching products:", e.message);
        res.status(500).json({success: false, message: "Server Error"});
    }
}

export const createProduct = async(req,res) =>{
    const {prod_name, description, price, stock, discount, category_id, brand_id, type_id} = req.body // tên biến phải giống với tên các key trong object được gửi từ frontend 

    if (!prod_name || !price || !description || !stock || !category_id || !brand_id || !type_id) {
        return res.status(400).json({success: false, message: "Please fill full required information"})
    }

    const quantity_sold = 0
    const newProduct = new Product({
        prod_name: prod_name,
        price: price,
        description: description,
        quantity_sold: quantity_sold,
        stock: stock,
        discount: discount || 0,
        category_id: category_id,
        brand_id: brand_id,
        type_id: type_id
    })
    
    try {
        const product = await newProduct.save()
        return res.status(200).json({success: true, data: newProduct})
    } catch(e) {

    }
    // const newProduct = {
    //     prod_name: prod_name,
    //     price: price,
    //     description: description,
    //     quantity_sold: 0,
    //     stock: stock,
    //     discount: discount || 0 
    //     category
    // }
    
}
