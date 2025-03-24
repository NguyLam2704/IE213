import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
    prod_id: { type: Number, required: true, unique: true },
    prod_name: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    description: { type: String },
    category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    brand_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand' },
    type_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Type' },
    discount: { type: Number },
    create_at: { type: Date, default: Date.now },
    update_at: { type: Date }
});

const Product = mongoose.model('Product', ProductSchema);

export default Product;