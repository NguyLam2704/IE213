import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';
import { loginThunk } from '../../../app/store/authThunks';


const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (email.trim() !== '' && password.trim() !== '') {
      try {
        await dispatch(loginThunk({ email, password })).unwrap();
        navigate('/admin');
      } catch (error) {
        alert('Đăng nhập thất bại: ' + error.message);
      }
    } else {
      alert('Vui lòng nhập đầy đủ email và mật khẩu');
    }
  };

  return (
    <div className="login-container">
      <div className="ad-auth-container">
        <h2 className="ad-title">Đăng nhập Quản trị viên</h2>
        <form className="ad-form" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            className="ad-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            className="ad-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="ad-button">Đăng nhập</button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
