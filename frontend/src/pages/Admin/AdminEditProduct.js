import React from 'react';
import { useParams } from 'react-router-dom';
import AdminProductForm from './AdminProductForm/AdminProductForm';
import { useGetProductsQuery } from '../../features/product/productApi';
const AdminEditProduct = () => {
  const { id } = useParams();
  const { data: products = [], isLoading } = useGetProductsQuery();
  const product = products.find((p) => p._id === id);

  const handleUpdate = async (data) => {

  };

  return (
    <div className="admin-edit-product">
      <AdminProductForm onSubmit={handleUpdate} initialData={product} isEdit />
    </div>
  );
};

export default AdminEditProduct;