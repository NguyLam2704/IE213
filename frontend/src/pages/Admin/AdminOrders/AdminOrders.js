import React from 'react';
import './AdminOrders.css';
import { useNavigate } from 'react-router-dom';

const dummyOrder = {
  _id: '68022764aee326341058a6d2',
  order_id: 1,
  user_id: null,
  total_price: 5000000,
  status: 'Completed',
  datePaid: '2025-04-18T10:20:20.337Z',
  pay_method: 'Credit Card',
  location: '123 Delivery Address',
  dateCreated: '2025-04-18T10:20:20.339Z',
  __v: 0,
  order_details: [
    {
      _id: '68022764aee326341058a6d5',
      order_detail_id: 1,
      order_id: '68022764aee326341058a6d2',
      prod_id: '68022764aee326341058a6b4',
      quantity: 1,
      price: 4500000,
      __v: 0
    },
    {
      _id: '68022764aee326341058a6d6',
      order_detail_id: 2,
      order_id: '68022764aee326341058a6d2',
      prod_id: '68022764aee326341058a6b7',
      quantity: 2,
      price: 100000,
      __v: 0
    }
  ],
  id: '68022764aee326341058a6d2'
};

const statuses = {
  Completed: 'status-completed',
  Canceled: 'status-canceled',
  Processing: 'status-processing'
};

const dummyOrders = Array.from({ length: 15 }, (_, i) => ({
  ...dummyOrder,
  order_id: i + 1,
  total_price: 1000000 + i * 100000,
  status: i % 3 === 0 ? 'Completed' : i % 3 === 1 ? 'Canceled' : 'Processing',
  location: `Address ${i + 1}`
}));


const AdminOrders = () => {
  const navigate = useNavigate();

  const handleClick = (id) => {
    navigate(`/admin/orders/${id}`);
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
              <th>Địa chỉ</th>
              <th>Ngày tạo</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
          {dummyOrders.map(order => (
              <tr key={order.order_id} onClick={() => navigate(`/admin/orders/${order._id}`)}>
                <td>{order.order_id}</td>
                <td>{order.total_price.toLocaleString('vi-VN')}₫</td>
                <td>{order.location}</td>
                <td>{new Date(order.dateCreated).toLocaleDateString()}</td>
                <td>
                  <span className={`status-label ${statuses[order.status]}`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default AdminOrders;