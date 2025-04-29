import Order from '../models/order.model.js'
import OrderDetail from '../models/order_detail.js';
import User from '../models/user.model.js';


export const fetchOrderHistory = async (req, res) => {
    const userId = req.query.user_id || '';
    const query = (userId) ? {orderBy: userId } : {};

    try {
        const order = await Order.find(query)
            // .populate({
            //     path: 'order_details'
            // })
            .populate({
                path: 'orderBy', // Populate the 'orderBy' field
                model: 'User',  // Specify the model to populate with (User model)
                select: 'name email phone_number ' // Optionally select specific fields from the User model
            })
            .sort({dateCreated: -1})

        res.status(200).json({success: true, data: order})
    } catch(e) {
        res.status(500).json({success: false, error: e.message})
    }
}

export const createOrder = async (req, res) => {
    const {_id} = req.user;
    const userCard = await User.findById(_id).select("cart");
    if (!req.body.total_price || !req.body || !req.body.pay_mehtod) {
        return res.status(400).json({success: false, message: "Please provide all fields"});
    }
    const {total_price, pay_method} = req.body;
    const newOrder = new Order({
        pay_method,
        total_price,
        dateCreated: new Date(),
        status: "pending",
    });

    try {
        const savedOrder = await newOrder.save();
        res.status(201).json({success: true, data: savedOrder});
    } catch (e) {
        console.error("Error in Create Order:", e.message);
        res.status(500).json({success: false, message: "Server Error"});
    }
}

export const fetchAllOrders = async (req, res) => {
    const limit = parseInt(req.query.limit) || 12;
    const page = parseInt(req.query.page) || 1;

    try {
        const totalDocument = await Order.countDocuments();  
        const orders = await Order.find({})
            .populate({
                path: 'products.product', // Populate the 'product' field within the 'products' array
                model: 'Product' // Specify the model to populate with (Product model)
            })
            .populate({
                path: 'orderBy', // Populate the 'orderBy' field
                model: 'User',  // Specify the model to populate with (User model)
                select: 'name email phone_number ' // Optionally select specific fields from the User model
            })
        res.status(200).json({
            success: true,
            page: page,
            limit: limit,
            totalPages: Math.ceil(totalDocument/limit),
            totalItems: totalDocument,
            data: orders})
    } catch (e) {
        res.status(500).json({success: false, error: e.message})
    }
}

export const updateOrderStatus = async (req, res) => {
    try {
        const orderStatus = ["Processing", "Cancelled", "Succeeded"];
        const orderId = req.body.order_id;
        const status = req.body.status;
        
        if (!orderStatus.includes(status)) {
            return res.status(400).json({success: false, message: "Status just be one of Processing, Cancelled, Succeeded"});
        }

        const order = await Order.findByIdAndUpdate(orderId, {status: status}, {new: true});
        if (!order) {
            return res.status(404).json({success: false, message: "Order not found"});
        }
        res.status(200).json({success: true, data: order});
    } catch (e) {
        res.status(500).json({success: false, error: e.message});
    }
}

export const fetchProductDetailsByOrderId = async (req, res) => {
    const orderId = req.params.id;
    try {
        const orderDetails = await OrderDetail.find({order_id: orderId})
            .populate("prod_id")
        if (!orderDetails) {
            return res.status(404).json({success: false, message: "No order details found for this order"});
        }
        res.status(200).json({success: true, data: orderDetails});
    } catch (e) {
        res.status(500).json({success: false, error: e.message});
    }
}