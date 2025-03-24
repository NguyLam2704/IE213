import { Link } from "react-router-dom";
import Header from "../../components/Header/Header";
import "./Login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({ setIsAuthenticated }) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === "" && password === "") {
      setIsAuthenticated(true);
      localStorage.setItem("isAuthenticated", "true"); // Lưu trạng thái đăng nhập
      navigate("/");
    } else {
      alert("Sai email hoặc mật khẩu!");
    }
  };

  return (
    <dix className="container">
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
            <p className="register-link">
            Bạn chưa có tài khoản? <Link to="/register">Đăng ký</Link>
            </p>
        </div>
        </div>
    </dix>
  );
}
