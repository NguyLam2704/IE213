import React from "react";
import "./OrdersHistory.css";

const OrdersHistory = () => {
  // Dữ liệu mẫu đơn hàng
  const orders = [
    { id: "DH001", status: "Đã giao", date: "15/03/2025", total: "500.000đ" },
    { id: "DH002", status: "Đã giao", date: "20/03/2025", total: "750.000đ" },
    { id: "DH003", status: "Đã giao", date: "25/03/2025", total: "1.200.000đ" },
  ];

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
        {orders.map((order) => (
          <div key={order.id} className="order-row">
            <span>{order.id}</span>
            <span>{order.status}</span>
            <span>{order.date}</span>
            <span>{order.total}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersHistory;
