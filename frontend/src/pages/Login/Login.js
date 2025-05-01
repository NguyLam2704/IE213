import { Link } from "react-router-dom";
import Header from "../../components/Header/Header";
import "./Login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { apiLogin } from "../../apis/user";
import Swal from "sweetalert2";
import { setCartCount } from "../../app/store/cartSlice";
import { useDispatch } from "react-redux";
import { faVolumeHigh } from "@fortawesome/free-solid-svg-icons";
import { fetchCartThunk } from "../../app/store/cartThunks";
import { loginThunk } from "../../app/store/authThunks";

export default function Login({ setIsAuthenticated }) {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();



  const handleLogin = async(e) => {
    e.preventDefault();
    try {
      // const response = await apiLogin({email,password});
      // //Thông báo thành công
      // console.log('Đăng nhập thành công:', response);
      Swal.fire('Đăng nhập thành công!', '', 'success');
      setIsAuthenticated(true);
      dispatch(loginThunk({email,password}));
      console.log(document.cookie); 
    // Sau cùng mới điều hướng
      navigate("/");
    } catch (err) {
      //Lỗi từ API
      console.log('Lỗi từ API:', err.response?.data || err.message);
      //Hiện thông báo dễ hiểu cho người dùng
      Swal.fire({
        title: 'Lỗi đăng nhập',
        text: err.response?.data?.message || 'Sai email hoặc mật khẩu!',
        icon: 'error',
      });
    }
  };

  const handleGoogleLoginSuccess = (response) => {
    console.log('Login Success:', response);
    setIsAuthenticated(true);
    navigate("/");
  };

  const handleGoogleLoginError = () => {
    console.log('Login Failed');
  };

  return (
    <div className="container">
    <Header setIsAuthenticated={setIsAuthenticated}/>
        <div className="login-container">
        <div className="login-box">
            <h2>Đăng Nhập</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Nhập email của bạn"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    // required
                />
                <input
                    type="password"
                    placeholder="Nhập mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    //required
                />
                <button type="submit" className="login-btn">Đăng Nhập</button>
            </form>
            <GoogleOAuthProvider clientId="345620387766-4f1bndku1jnobkb6316heea4kfe0369b.apps.googleusercontent.com">
              <div className="App">
                <GoogleLogin
                  onSuccess={handleGoogleLoginSuccess}
                  onError={handleGoogleLoginError}
                />
              </div>
            </GoogleOAuthProvider>
            <p className="register-link">
            Bạn chưa có tài khoản? <Link to="/register">Đăng ký</Link>
            </p>
        </div>
        </div>
    </div>
  );
}
