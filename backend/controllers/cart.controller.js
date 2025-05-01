import User from '../models/user.model.js';
import Cart from '../models/cart.model.js';
import mongoose from 'mongoose';

//thêm/giảm sản phẩm trong giỏ hàng
export const addCart = async (req, res) => {
    //Lấy user_id
    const user_id = req.user._id;
    const {product_id,quantity} = req.body;
    //Lấy cart của user
    const productObjectId = new mongoose.Types.ObjectId(product_id);
    const cart_user = await Cart.findOne({user_id: user_id});
    //Nếu chưa có cart thì tạo mới cart
    if (!cart_user) {
        const newCart = new Cart({
            user_id: user_id,
            cart: [{ product: product_id, quantity }],
            count_cart: quantity,          // khởi tạo luôn số lượng
        });
        await newCart.save();

        return res.status(200).json({
            success: true, 
            message: "Create new cart",
        });
    }
    //Lấy item trong cart
    // console.log(cart_user.cart," ", product_id);
    if (!cart_user.cart){
        await Cart.updateOne(
            { user_id: user_id },
            {
                $push: {
                    cart: { product: product_id, quantity: quantity }
                },
                $inc: {
                    count_cart: quantity 
                },
            },
            {new : true}
        );
        return res.status(200).json({
            success: true, 
            message: "Add new product to cart",
            data: {
                product_id: product_id,
                quantity: quantity,
            }
        });
    }
    const product_in_cart = cart_user.cart.find(
        item => item.product?.toString() === product_id.toString()
    );
    // console.log(product_in_cart, " dà");
    try {
        // console.log("ok1");
        // Nếu không có sản phẩm thì thêm mới sản phẩm vào giỏ hàng
        if (!product_in_cart) {
            // console.log("ok1");
            if (quantity < 0) {
                // console.log("ok2");
                return res.status(200).json({
                    success: true, 
                    message: "No product to delete",
                });
            }
            await Cart.updateOne(
                { user_id: user_id },
                {
                    $push: {
                        cart: { product: product_id, quantity: quantity }
                    },
                    $inc: {
                        count_cart: quantity 
                    },
                },
                {new : true}
            );
            return res.status(200).json({
                success: true, 
                message: "Add new product to cart",
                data: {
                    product_id: product_id,
                    quantity: quantity,
                }
            });
        }
        // console.log(product_in_cart.quantity);
        // Nếu có sản phẩm phẩm trong giỏ hàng và đang muốn giảm số lượng sản phẩm với điều kiện số lượng giảm là hết sản phẩm trong giỏ hàng -> xóa sản phẩm
        if (quantity <0 && product_in_cart.quantity + quantity <=0) {
            await Cart.updateOne(
                { user_id: user_id }, // tìm User theo ID
                {
                $pull: { "cart": { product: product_id } }, // Xóa sản phẩm có product_id trong giỏ
            },
            {new: true}
            );
            return res.status(200).json({
                success: true,
                message: "product delete"
            })

        }
        // console.log("ok");
        // ngược lại thêm/xóa số lượng sản phẩm 
        const found = await Cart.findOne({ user_id: new mongoose.Types.ObjectId(user_id), 'cart.product': productObjectId });
        const up = await Cart.findOneAndUpdate(
            { user_id, 'cart.product': product_id },
            { $inc: { 'cart.$.quantity': quantity } },
            { new: true }    
        );
        // console.log(up);
        // console.log("ok");
        res.status(201).json({
            success: true, 
            message: "Product quantity have change", 
            data: {
                product_id: product_id,
                quantity: quantity,
            }
            });    
        } catch (e) {
            console.error("Error in cart:", e.message);
            res.status(500).json({success: false, message: "Server Error"});
        }
}

//xóa sản phẩm trong giỏ hàng
export const deleteCart = async (req, res) => {
    //Lấy userid từ token
    const user_id = req.user._id;
    const {product_id} = req.body;
    // console.log(user_id);
    try {
        //Xóa sản phẩm trong cart của User
        // 1. Tìm user để lấy quantity của sản phẩm bị xóa
        const cart_user = await Cart.findOne({user_id: user_id});
        const cartItem = await cart_user.cart.find(item => item.product.toString() === product_id.toString());
        // console.log(cartItem);
        if (!cartItem) {
            throw new Error('Sản phẩm không tồn tại trong giỏ hàng');
        }

        // 2. Xóa sản phẩm và giảm count_cart
        await Cart.updateOne(
            { user_id: user_id },
            {
                $pull: { cart: { product: product_id } },
            }
        );

        res.status(201).json({success: true, message: "Product have been deleted"});
    } catch (e) {
        console.error("Error in delete product:", e.message);
        res.status(500).json({success: false, message: "Server Error"});
    }
}

//lấy hết sản phẩm trong giỏ hàng
export const getCart = async (req, res) => {
    //Lấy userid từ token
    // console.log(req.user._id)
    const user_id = req.user._id;

    try {
        // console.log(user_id);
        // Đúng: tìm document Cart có trường user_id khớp
        const cart_user = await Cart.findOne({ user_id: user_id });
        // console.log(cart_user);
        const cartItem = cart_user.cart;
        res.status(201).json({success: true, items: cartItem});
    } catch (e) {
        console.error("Error in get cart:", e.message);
        res.status(500).json({success: false, message: "Server Error"});
    }
}

//thay đổi số lượng sản phẩm trong giỏ hàng
export const changeCart = async (req, res) => {
    //Lấy userid từ token
    const user_id = req.user._id;
    // console.log(user_id);
    const {product_id,quantity} = req.body;
    try {
        //Tìm cart của user
        const cart_user = await Cart.findOne({user_id: user_id});
        //Nếu không có cart thì trả về lỗi
        if (!cart_user) {
            return res.status(404).json({
                success: false, 
                message: "Cart not found",
            });
        }
        //Tìm sản phẩm trong cart
        const product_in_cart = await cart_user.cart.find(item => item.product.toString() === product_id.toString());
        //Nếu không có sản phẩm thì trả về lỗi
        if (!product_in_cart) {
            return res.status(404).json({
                success: false, 
                message: "Product not found in cart",
            });
        }
        //Nếu có sản phẩm thì thay đổi số lượng sản phẩm
        await Cart.updateOne(
            { user_id: user_id, 'cart.product': product_id },
            { $set: { 'cart.$.quantity': quantity } },
            { new: true }    // hoặc returnDocument: 'after' với Mongoose >=6
        );
        res.status(201).json({
            success: true, 
            message: "Product quantity have change", 
            data: {
                product_id: product_id,
                quantity: quantity,
            }
            });    
    } catch (e) {
        console.error("Error in change cart:", e.message);
        res.status(500).json({success: false, message: "Server Error"});
    }
}
