import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
    order_id: { type: Number, required: true, unique: true },
    products: [{
        product: {type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        count: {type: Number, default: 1},
        color: {type: String},
    }],
    dateCreated: { type: Date, default: Date.now },
    total_price: { type: Number, required: true },
    status: { 
        type: String ,
        default: "Processing",
        enum: ["Cancelled","Processing","Succeeded"],
    },    
    pay_method: { type: String },
    orderBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    }
}); 

const Order = mongoose.model('Order', OrderSchema);

export default Order;