import React, { useState, useEffect } from 'react';
import './AdminProductForm.css';
import { useNavigate } from 'react-router-dom';

const AdminProductForm = ({ initialData = {}, onSubmit, isEdit = false }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    prod_name: '',
    price: '',
    stock: '',
    quantity_sold: '',
    description: '',
    category_id: '',
    brand_id: '',
    type_id: '',
    discount: '',
    images: [],
  });
  const [imagePreview, setImagePreview] = useState([]);

  useEffect(() => {
    if (isEdit && initialData) {
      setFormData({
        ...initialData,
        category_id: initialData.category_id?._id,
        brand_id: initialData.brand_id?._id,
        type_id: initialData.type_id?._id,
        images: initialData.images || [],
      });
      setImagePreview(initialData.images);
    }
  }, [initialData, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const preview = files.map((file) => URL.createObjectURL(file));
    setImagePreview(preview);
    setFormData((prev) => ({ ...prev, images: files }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <h2>{isEdit ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</h2>

      <label>Tên sản phẩm</label>
      <input name="prod_name" value={formData.prod_name} onChange={handleChange} required />

      <label>Giá gốc</label>
      <input name="price" type="number" value={formData.price} onChange={handleChange} required />

      <label>Số lượng trong kho</label>
      <input name="stock" type="number" value={formData.stock} onChange={handleChange} required />

      <label>Số lượng đã bán</label>
      <input name="quantity_sold" type="number" value={formData.quantity_sold} onChange={handleChange} />

      <label>Mô tả</label>
      <textarea name="description" value={formData.description} onChange={handleChange} rows="4" />

      <label>Danh mục</label>
      <select name="category_id" value={formData.category_id} onChange={handleChange}>
        {/* fetch list category từ API */}
        <option value="">Chọn danh mục</option>
      </select>

      <label>Thương hiệu</label>
      <select name="brand_id" value={formData.brand_id} onChange={handleChange}>
        <option value="">Chọn thương hiệu</option>
      </select>

      <label>Loại sản phẩm</label>
      <select name="type_id" value={formData.type_id} onChange={handleChange}>
        <option value="">Chọn loại</option>
      </select>

      <label>Giảm giá (%)</label>
      <input name="discount" type="number" value={formData.discount} onChange={handleChange} />

      <label>Tải lên hình ảnh sản phẩm</label>
      <input type="file" multiple accept="image/*" onChange={handleImageChange} />
      <div className="image-preview">
        {imagePreview.map((src, idx) => (
          <img key={idx} src={src} alt={`img-${idx}`} />
        ))}
      </div>

      <div className="form-actions">
        <button type="submit">{isEdit ? 'Lưu thay đổi' : 'Thêm sản phẩm'}</button>
        <button type="button" className="cancel" onClick={() => navigate("/admin/products")}>Hủy</button>
      </div>
    </form>
  );
};

export default AdminProductForm;
