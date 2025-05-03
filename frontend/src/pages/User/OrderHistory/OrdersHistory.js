import React from "react";
import "./OrdersHistory.css";
import { useGetOrderHistoryQuery } from "../../../features/order/orderApi";

const OrdersHistory = () => {
  const userId = "6802248630cc2553afa7a33d"; // lấy từ Redux
  const { data: orders = [], isLoading, error } = useGetOrderHistoryQuery(userId);

  if (isLoading) return <p>Đang tải dữ liệu đơn hàng...</p>;
  if (error) return <p>Đã xảy ra lỗi khi tải đơn hàng!</p>;

  return (
    <div className="orders-history">
      <h2>Đơn hàng đã đặt</h2>
      <div className="orders-table">
        <div className="order-row order-header">
          <span>Mã đơn</span>
          <span>Trạng thái</span>
          <span>Ngày</span>
          <span>Tổng tiền</span>
        </div>
        {orders.length > 0 ? (
          orders.map((order) => (
            <div key={order._id} className="order-row">
              <span>{order.order_code || order._id}</span>
              <span>{order.status}</span>
              <span>{new Date(order.createdAt).toLocaleDateString()}</span>
              <span>{Number(order.total_price).toLocaleString()}đ</span>
            </div>
          ))
        ) : (
          <p>Chưa có đơn hàng nào.</p>
        )}
      </div>
    </div>
  );
};

export default OrdersHistory;
