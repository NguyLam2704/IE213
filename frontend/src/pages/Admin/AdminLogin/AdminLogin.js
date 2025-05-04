import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';
import { useDispatch } from 'react-redux';
import { loginThunk } from '../../../app/store/authThunks';
import Swal from 'sweetalert2';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
    const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
          const result = await dispatch(loginThunk({ email, password, role: "admin" }));
        
          // Kiểm tra nếu login bị rejected (bị rejectWithValue)
          if (loginThunk.rejected.match(result)) {
            throw new Error(result.payload || "Đăng nhập thất bại");
          }
        
          Swal.fire('Đăng nhập thành công!', '', 'success');
          navigate("/admin");
        } catch (err) {
          console.log('Lỗi từ API:', err.message);
          Swal.fire({
            title: 'Lỗi đăng nhập',
            text: err.message || 'Sai email hoặc mật khẩu!',
            icon: 'error',
          });
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
