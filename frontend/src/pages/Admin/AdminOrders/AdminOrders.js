import React from 'react';
import './AdminOrders.css';
import { useNavigate } from 'react-router-dom';
import { useGetOrdersQuery } from '../../../features/order/orderApi';

const AdminOrders = () => {
  const navigate = useNavigate();
  const { data = {}, isLoading } = useGetOrdersQuery();
  const { orders = [] } = data;

  const handleClick = (id) => {
    navigate(`/admin/orders/${id}`);
  };
  const statuses = {
    Processing: "processing",
    Succeeded: "succeeded",
    Cancelled: "cancelled"
  };
  return (
    <div className="admin-orders">
      <h2>Danh sách đơn hàng</h2>
      <div className="product-table">
        <table>
          <thead>
            <tr>
              <th>ID đơn hàng</th>
              <th>Giá trị đơn</th>
              <th>Khách hàng</th>
              <th>Ngày tạo</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={5}>Đang tải...</td></tr>
            ) : (
              orders.map(order => (
                <tr key={order._id} onClick={() => navigate(`/admin/orders/${order._id}`)}>
                  <td>{order.order_id}</td>
                  <td>{order.total_price.toLocaleString('vi-VN')}₫</td>
                  <td>{order.orderBy?.name || "Không rõ"}</td>
                  <td>{new Date(order.dateCreated).toLocaleDateString()}</td>
                  <td>
                    <span className={`status-label ${statuses[order.status] || 'unknown'}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;