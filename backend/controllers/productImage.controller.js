import productImage from '../models/productImage.model.js';

export const fetchImagesByProductId = async (req, res) => {
    const productId = req.params.id;
    try {
        const images = await productImage.find({ prod_id: productId });
        if (!images) {
            return res.status(404).json({ success: false, message: "No images found for this product" });
        }
        return res.status(200).json({ success: true, data: images });
    } catch (e) {
        console.error("Error in fetching images:", e.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
}

// Upload hình ảnh sản phẩm
export const uploadImage = async (req, res) => {
    try {
        const imageUrl = req.file.path; // đường dẫn ảnh trên Cloudinary
        res.json({ success: true, data: {imageUrl: imageUrl}  });
      } catch (error) {
        res.status(500).json({ error: 'Upload failed' });
      }
}