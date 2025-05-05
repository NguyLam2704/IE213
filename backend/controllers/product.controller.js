import Product from '../models/product.model.js';
import Category from '../models/category.model.js';
import Brand from '../models/brand.model.js';
import ProductImage from '../models/productImage.model.js';
import Type from '../models/type.model.js'
import mongoose from 'mongoose';
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
const ObjectId = mongoose.Types.ObjectId;

dotenv.config();
// Lấy sản phẩm theo id 
export const fetchProductById = async (req, res) => {
    const productId = req.params.id; // lấy từ URL parameter
    try {
        const product = await Product.findOne({ _id: productId , is_active: true})
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

// Lấy thông tin tất cả sản phẩm
export const fetchAllProducts = async (req, res) => {
    // Price Filter 
    const minPrice = parseInt(req.query.minPrice) || 0
    const maxPrice = parseInt(req.query.maxPrice) || Number.MAX_VALUE
    const priceFilter = (minPrice > 0 || maxPrice < Number.MAX_VALUE) ? { price: { $gte: minPrice, $lte: maxPrice } } : {};
    const activeFilter = {is_active: true}
    // Category Filter
    const category = (req.query.category) || ''
    const categoryFilter = (category) ? {'category_id':category } : {};

    // Brand Filter
    const brand = (req.query.brand) || ''
    const brandFilter = (brand) ? {brand_id: brand} : {}

    // Type Filter
    const type = (req.query.type) || ''
    const typeFilter = (type) ? {type_id: type} : {}
    
    // keyword search Filter //bổ sung
    const search = req.query.search || '';
    const keywordFilter = search ? { prod_name: { $regex: search, $options: 'i' } } : {};

    // Combine filters
    const query = { ...priceFilter, ...categoryFilter, ...brandFilter, ...typeFilter, ...keywordFilter, ...activeFilter};
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

// Tạo sản phẩm mới
export const createProduct = async(req,res) =>{
    const {prod_name, description, price, stock, discount, category_id, brand_id, type_id} = req.body // tên biến phải giống với tên các key trong object được gửi từ frontend 

    if (!prod_name || !price || !description || !stock || !category_id || !brand_id || !type_id) {
        return res.status(400).json({success: false, message: "Please fill full required information"})
    }

    const exampleDescription = `Vợt cầu lông Yonex Astrox 99 Pro là một trong những cây vợt cao cấp nhất của Yonex, được thiết kế dành riêng cho người chơi theo phong cách tấn công mạnh mẽ và uy lực. Với hàng loạt công nghệ tiên tiến, cây vợt này mang đến hiệu suất vượt trội cho các vận động viên chuyên nghiệp và người chơi có kỹ thuật cao.
                
    📊 Thông số kỹ thuật
    - Trọng lượng: 4U (80-84g).
    - Độ cứng: Siêu cứng – hỗ trợ tối đa lực đập mạnh và kiểm soát tốt.
    - Chu vi cán vợt: G5.
    - Chiều dài tổng thể: 675 mm.
    - Điểm cân bằng: Khoảng 303 mm – nặng đầu, phù hợp lối chơi tấn công.
    - Sức căng dây: 3U (21–29 lbs), 4U (20–28 lbs).

    🎯 Đặc điểm nổi bật
    - Công nghệ POWER-ASSIST BUMPER: Được tích hợp ở đỉnh vợt, tăng trọng lượng đầu vợt thêm 55% so với gen thông thường, giúp tăng lực đập cầu và khả năng tấn công mạnh mẽ hơn. 
    - Vật liệu VOLUME CUT RESIN: Một loại nhựa đột phá được áp dụng toàn bộ trên khung và trục vợt, giúp phân bổ trọng lượng đồng đều, tăng độ bền và cải thiện độ chính xác trong từng cú đánh. 
    - Mặt vợt ISOMETRIC Plus: Thiết kế mặt vợt hình vuông mở rộng điểm ngọt (sweetspot), hỗ trợ những cú đánh chính xác ngay cả khi tiếp xúc lệch tâm. 
    - Trục vợt Extra Slim Shaft: Trục vợt siêu mỏng giúp giảm lực cản không khí khi vung vợt, tăng tốc độ và lực đánh. 
    - Chụp mũ vợt Energy Boost CAP PLUS: Tối đa hóa hiệu suất trục, tăng độ ổn định và hỗ trợ lực đánh. 
    - Hệ thống Rotational Generator System: Phân bổ trọng lượng tối ưu ở đầu vợt, khớp nối chữ T và phần tay cầm, giúp vợt cân bằng và linh hoạt trong từng pha cầu. 

    👤 Đối tượng phù hợp 
    Yonex Astrox 99 Pro lý tưởng cho người chơi có lực tay khỏe, kỹ thuật tốt và yêu thích lối đánh tấn công mạnh mẽ. Đặc biệt phù hợp với các vận động viên chuyên nghiệp hoặc người chơi trình độ cao đang tìm kiếm một cây vợt hỗ trợ tối đa cho những cú smash uy lực và kiểm soát cầu chính xác.`
    const quantity_sold = 0
    const productMaxId = await Product.findOne({}).sort({prod_id: -1}) // Tìm sản phẩm có id lớn nhất
    
    let instruction = ""
    let prompt = ""
    if (description != "Using AI") {
         prompt = `Formatted product descridescription in markdown format. ${description}`;
    } 
    else {
        instruction = `You are an AI specializing in writing product descriptions for badminton-related products. 
        Your task is to generate engaging, informative, and well-structured descriptions that enhance their understanding of the product.
        The description should include the product's features, benefits, and any unique selling points.
        Write a description without a title. Just a detailed description.
        This is an example of product description Yonex Astrox 99 Pro: ${exampleDescription}
        Response in Vietnamese and markdown format.
        `;
        prompt = `Write a product description for ${prod_name}.`;
    }
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash"});
    try {
        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 1500,
            },
            systemInstruction: instruction,
        });
        const response = result.response;
        const formattedDescription = response.text();
        const newProduct = new Product({
            prod_id: productMaxId.prod_id + 1,
            prod_name: prod_name,
            price: price,
            description: formattedDescription,
            quantity_sold: quantity_sold,
            stock: stock,
            discount: discount || 0,
            category_id: category_id,
            brand_id: brand_id,
            type_id: type_id
    })
    
    
        const product = await newProduct.save()
        return res.status(200).json({success: true, data: newProduct})
    } catch(e) {
        console.error("Error in creating product:", e.message);
        return res.status(500).json({success: false, message: "Server Error"});
    }    
}

  
// Cập nhật thông tin sản phẩm
export const updateProduct = async(req,res) => {
    const productId = req.params.id;
    const {prod_name, description, price, stock, discount, quantity_sold, category_id, brand_id, type_id} = req.body

    if (!prod_name || !price || !description || !stock || !discount || quantity_sold === undefined || !category_id || !brand_id || !type_id) {
        return res.status(400).json({success: false, message: "Please fill full required information"})
    }

    const exampleDescription = `Vợt cầu lông Yonex Astrox 99 Pro là một trong những cây vợt cao cấp nhất của Yonex, được thiết kế dành riêng cho người chơi theo phong cách tấn công mạnh mẽ và uy lực. Với hàng loạt công nghệ tiên tiến, cây vợt này mang đến hiệu suất vượt trội cho các vận động viên chuyên nghiệp và người chơi có kỹ thuật cao.
                
    📊 Thông số kỹ thuật
    - Trọng lượng: 4U (80-84g).
    - Độ cứng: Siêu cứng – hỗ trợ tối đa lực đập mạnh và kiểm soát tốt.
    - Chu vi cán vợt: G5.
    - Chiều dài tổng thể: 675 mm.
    - Điểm cân bằng: Khoảng 303 mm – nặng đầu, phù hợp lối chơi tấn công.
    - Sức căng dây: 3U (21–29 lbs), 4U (20–28 lbs).

    🎯 Đặc điểm nổi bật
    - Công nghệ POWER-ASSIST BUMPER: Được tích hợp ở đỉnh vợt, tăng trọng lượng đầu vợt thêm 55% so với gen thông thường, giúp tăng lực đập cầu và khả năng tấn công mạnh mẽ hơn. 
    - Vật liệu VOLUME CUT RESIN: Một loại nhựa đột phá được áp dụng toàn bộ trên khung và trục vợt, giúp phân bổ trọng lượng đồng đều, tăng độ bền và cải thiện độ chính xác trong từng cú đánh. 
    - Mặt vợt ISOMETRIC Plus: Thiết kế mặt vợt hình vuông mở rộng điểm ngọt (sweetspot), hỗ trợ những cú đánh chính xác ngay cả khi tiếp xúc lệch tâm. 
    - Trục vợt Extra Slim Shaft: Trục vợt siêu mỏng giúp giảm lực cản không khí khi vung vợt, tăng tốc độ và lực đánh. 
    - Chụp mũ vợt Energy Boost CAP PLUS: Tối đa hóa hiệu suất trục, tăng độ ổn định và hỗ trợ lực đánh. 
    - Hệ thống Rotational Generator System: Phân bổ trọng lượng tối ưu ở đầu vợt, khớp nối chữ T và phần tay cầm, giúp vợt cân bằng và linh hoạt trong từng pha cầu. 

    👤 Đối tượng phù hợp 
    Yonex Astrox 99 Pro lý tưởng cho người chơi có lực tay khỏe, kỹ thuật tốt và yêu thích lối đánh tấn công mạnh mẽ. Đặc biệt phù hợp với các vận động viên chuyên nghiệp hoặc người chơi trình độ cao đang tìm kiếm một cây vợt hỗ trợ tối đa cho những cú smash uy lực và kiểm soát cầu chính xác.`
    
    let instruction = ""
    let prompt = ""
    if (description == "Using AI") {
        instruction = `You are an AI specializing in writing product descriptions for badminton-related products. 
        Your task is to generate engaging, informative, and well-structured descriptions that enhance their understanding of the product.
        The description should include the product's features, benefits, and any unique selling points.
        Write a description without a title. Just a detailed description.
        This is an example of product description Yonex Astrox 99 Pro: ${exampleDescription}
        Response in Vietnamese and markdown format.
        `;
        prompt = `Write a product description for ${prod_name}.`;
    } 
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash"});
    try {
        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 1500,
            },
            systemInstruction: instruction,
        });
        const response = result.response;
        const formattedDescription = response.text();
        if (description == "Using AI") {
            description = formattedDescription
        }
        const product = await Product.findByIdAndUpdate(
            productId,
            { 
                prod_name: prod_name,
                price: price,
                description: description,
                quantity_sold: quantity_sold,
                stock: stock,
                discount: discount || 0,
                category_id: category_id,
                brand_id: brand_id,
                type_id: type_id
            },
            { new: true }
        );

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        return res.status(200).json({ success: true, data: product });
    } catch (e) {
        console.error("Error in updating product:", e.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
}

export const deactiveProduct = async (req, res) => {
    const productId = req.params.id;
    try {
        const product = await Product.findByIdAndUpdate(
            productId,
            { is_active: false },
            { new: true }
        );

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        return res.status(200).json({ success: true, message: "Product deleted successfully" });
    } catch (e) {
        console.error("Error in deleting product:", e.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
}