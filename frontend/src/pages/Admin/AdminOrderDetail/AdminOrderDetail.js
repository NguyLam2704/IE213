// AdminOrderDetail.js
import React, { useState, useEffect } from 'react';
import './AdminOrderDetail.css';
import { useGetOrdersQuery, useUpdateOrderStatusMutation  } from '../../../features/order/orderApi';
import { useParams } from 'react-router-dom';


const AdminOrderDetail = () => {
  const statuses = {
    Processing: "processing",
    Succeeded: "succeeded",
    Cancelled: "cancelled"
  };

  const { id } = useParams(); 
  const { data = {}, isLoading } = useGetOrdersQuery();
  const { orders = [] } = data;
  const order = orders.find((o) => o._id === id);
  const [status, setStatus] = useState(order?.status || '');
  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const { refetch } = useGetOrdersQuery(); // 👈 lấy refetch

  // useEffect(() => {
  //   if (order) setStatus(order.status);
  // }, [order]);

  const handleSave = async () => {
    try {
      await updateOrderStatus({ order_id: order._id, status }).unwrap();
      alert(`Trạng thái cập nhật thành công: ${status}`);
      refetch(); // gọi lại danh sách đơn hàng
    } catch (error) {
      console.error("Cập nhật thất bại:", error);
      alert("Có lỗi xảy ra khi cập nhật trạng thái!");
    }
  };
  if (isLoading || !order) return <p>Đang tải hoặc không tìm thấy đơn hàng...</p>;
  return (
    <div className='ad-order-detail-container'>
      <h2>Chi tiết đơn hàng</h2>

      <div className="ad-order-detail">
        <div className="ad-order-left">
          <div className="ad-order-info-box">
            <table>
              <thead>
                <tr>
                  <th>Ảnh</th>
                  <th>Tên</th>
                  <th>Đơn giá</th>
                  <th>Số lượng</th>
                  <th>Tổng</th>
                </tr>
              </thead>
              <tbody>
                {order.products.map((item, idx) => (
                  <tr key={item._id}>
                    <td>
                      <img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaIVPg8dBJJanmRBXWXPdvNnI8ZWK7PHP16w&s"
                        alt="product"
                        className="ad-order-product-image"
                      />
                    </td>
                    <td className="ad-order-product-name">{item.product?.prod_name || `Sản phẩm ${idx + 1}`}</td>
                    <td className="ad-order-product-price">{item.product?.price.toLocaleString()} đ</td>
                    <td className="ad-order-product-qty">{item.count}</td>
                    <td className="ad-order-product-total">{(item.product?.price * item.count).toLocaleString()} đ</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="ad-order-info-box">
            <p>Tạm tính: {
              order.products.reduce((sum, i) => sum + i.product?.price * i.count, 0).toLocaleString()
            } đ</p>
            <p>Phí vận chuyển: 0 đ</p>
            <p><strong>Tổng cộng: {order.total_price.toLocaleString()} đ</strong></p>
          </div>
        </div>

        <div className="ad-order-right">
          <div className="ad-order-info-box">
            <h3>Tóm tắt</h3>
            <p>Mã đơn hàng: {order.order_id}</p>
            <p>Ngày đặt hàng: {new Date(order.dateCreated).toLocaleDateString()}</p>
            <p>Họ và tên: {order.orderBy?.name}</p>
            <p>Email: {order.orderBy?.email}</p>
          </div>

          <div className="ad-order-info-box">
            <h3>Địa chỉ</h3>
            <p>{order.location || "Chưa có địa chỉ"}</p>
          </div>

          <div className="ad-order-info-box ad-order-status-box">
            <h3>Trạng thái đơn hàng</h3>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={`status-label ${statuses[status] || 'unknown'}`}
            >
              {Object.keys(statuses).map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <button className="ad-order-save-button" onClick={handleSave}>Lưu</button>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetail;