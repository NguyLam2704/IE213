import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (email.trim() !== '' && password.trim() !== '') { ///không rỗng thì cho vào
      console.log('Đăng nhập:', { email, password });
      // Gọi API login 
      navigate('/admin');
    } else {
      alert('Vui lòng nhập đầy đủ email và mật khẩu');
    }
  };

  return (
    <div className="login-container">
      <div className="ad-auth-container">
        <h2 className="ad-title">Đăng nhập</h2>
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
