import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

import { useState } from "react";
import "./Order.css";

export default function Cart({ isAuthenticated, setIsAuthenticated }) {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    note: '',
  });
  const cart = [
    { id: 1, name: 'LI-NING NO.1 BOOST STRING', price: 900000, quantity: 1 },
    { id: 2, name: 'LI-NING NO.2 BOOST STRING', price: 900000, quantity: 1 },
    { id: 3, name: 'LI-NING NO.3 BOOST STRING', price: 900000, quantity: 1 },
    { id: 4, name: 'LI-NING NO.4 BOOST STRING', price: 900000, quantity: 1 },
  ];
  const discountCode = 'SALEFORYOURLIFE';
  const discountAmount = 300000;
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const finalTotal = total - discountAmount;

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = () => {
    console.log('Đặt hàng:', formData);
    alert('Đơn hàng đã được gửi!');
  };
  return (

    <>
      <Header isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated}/>

      <div className="user-container">
        <div className="user-header-container">
          <p className="user-header">TRANG CHỦ {'>'} GIỎ HÀNG</p>
        </div>
        <div className="order-container">
        <div className="order-form">
          <h3>Thông tin đặt hàng</h3>
          <label>*Họ và tên:</label>
          <input type="text" name="name" placeholder="Nhập họ và tên" onChange={handleChange} />

          <label>*Địa chỉ:</label>
          <input type="text" name="address" placeholder="Nhập địa chỉ" onChange={handleChange} />

          <label>*Số điện thoại:</label>
          <input type="text" name="phone" placeholder="Nhập số điện thoại" onChange={handleChange} />

          <label>*Email:</label>
          <input type="email" name="email" placeholder="Nhập email" onChange={handleChange} />

          <label>Ghi chú:</label>
          <textarea name="note" placeholder="Ghi chú về đơn hàng" onChange={handleChange}></textarea>
        </div>

        <div className="order-summary">
          <h3>Đơn hàng</h3>
          {cart.map(item => (
            <div className="order-item" key={item.id}>
              <span>{item.name} ×{item.quantity}</span>
              <span>{item.price.toLocaleString()} đ</span>
            </div>
          ))}
          <div className="order-total">
            <span>Tổng đơn</span>
            <span style={{ color: '#f2c401', fontWeight: 'bold', fontSize: '18px' }}>
              {finalTotal.toLocaleString()} đ
            </span>
          </div>
          <button className="order-button" onClick={handleSubmit}>ĐẶT HÀNG</button>
        </div>
      </div>

      </div>
      <Footer/>
    </>
  );
}
