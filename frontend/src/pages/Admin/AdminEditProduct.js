import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminProductForm from './AdminProductForm/AdminProductForm';
import { useGetProductsQuery, useUpdateProductMutation } from '../../features/product/productApi';
import { useCreateProductImageMutation } from '../../features/services/productImageApi';

const AdminEditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: products = [], isLoading, refetch } = useGetProductsQuery();
  const [updateProduct] = useUpdateProductMutation();
  const [uploadImage] = useCreateProductImageMutation();

  const initialData = products.find((p) => p._id === id);

  const handleUpdate = async (data) => {
    try {
      const { images, ...productData } = data;

      // B1: Cập nhật sản phẩm
      await updateProduct({ id, productData }).unwrap();

      // B2: Upload ảnh mới nếu có
      if (images && images.length > 0 && images[0] instanceof File) {
        for (let i = 0; i < images.length; i++) {
          const formData = new FormData();
          formData.append('image', images[i]);
          formData.append('prod_id', id);
          formData.append('is_primary_image', i === 0 ? 'true' : 'false');
          await uploadImage(formData).unwrap();
        }
      }

      await refetch();
      if (window.confirm("Cập nhật thành công! Quay lại danh sách?")) {
        navigate('/admin/products');
      }

    } catch (err) {
      console.error("Lỗi khi cập nhật sản phẩm:", err);
      alert("Không thể cập nhật sản phẩm. Kiểm tra thông tin hoặc kết nối mạng.");
    }
  };

  if (isLoading || !initialData) return <div>Đang tải...</div>;

  return (
    <div className="admin-edit-product">
      <AdminProductForm
        initialData={initialData}
        onSubmit={handleUpdate}
        isEdit
      />
    </div>
  );
};

export default AdminEditProduct;
