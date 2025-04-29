// AdminOrderDetail.js
import React, { useState } from 'react';
import './AdminOrderDetail.css';

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
    },
    {
      _id: '68022764aee326341058a6d6',
      order_detail_id: 2,
      order_id: '68022764aee326341058a6d2',
      prod_id: '68022764aee326341058a6b7',
      quantity: 2,
      price: 100000,
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
    },
  ],
  id: '68022764aee326341058a6d2'
};

const statusOptions = ['Processing', 'Completed', 'Cancelled'];
const getStatusClass = (status) => {
    switch (status) {
      case 'Completed':
        return 'status-completed';
      case 'Cancelled':
        return 'status-canceled';
      case 'Processing':
        return 'status-processing';
      default:
        return '';
    }
  };
const AdminOrderDetail = () => {
  const [status, setStatus] = useState(dummyOrder.status);

  const getTotal = () => {
    return dummyOrder.order_details.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const handleSave = () => {
    alert(`Trạng thái đơn hàng đã được cập nhật thành: ${status}`);
  };

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
                  {dummyOrder.order_details.map((item, idx) => (
                      <tr key={item._id}>
                      <td><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaIVPg8dBJJanmRBXWXPdvNnI8ZWK7PHP16w&s" alt="product" className="ad-order-product-image" /></td>
                      <td className="ad-order-product-name">Sản phẩm {idx + 1}</td>
                      <td className="ad-order-product-price">{item.price.toLocaleString()} đ</td>
                      <td className="ad-order-product-qty">{item.quantity}</td>
                      <td className="ad-order-product-total">{(item.price * item.quantity).toLocaleString()} đ</td>
                      </tr>
                  ))}
                  </tbody>
              </table>
          </div>

          <div className="ad-order-info-box">
            <p>Tạm tính: {getTotal().toLocaleString()} đ</p>
            <p>Phí vận chuyển:</p>
            <p><strong>Tổng cộng: {dummyOrder.total_price.toLocaleString()} đ</strong></p>
          </div> 
        </div>

        <div className="ad-order-right">
          <div className="ad-order-info-box">
            <h3>Tóm tắt</h3>
            <p>Mã đơn hàng: {dummyOrder.order_id}</p>
            <p>Ngày đặt hàng: {new Date(dummyOrder.dateCreated).toLocaleDateString()}</p>
            <p>Họ và tên:</p>
            <p>Số điện thoại:</p>
            <p>Email:</p>
          </div>

          <div className="ad-order-info-box">
            <h3>Địa chỉ</h3>
            <p>{dummyOrder.location}</p>
          </div>

          <div className="ad-order-info-box ad-order-status-box">
            <h3>Trạng thái đơn hàng</h3>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className={getStatusClass(status)} >
              {statusOptions.map(option => (
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
