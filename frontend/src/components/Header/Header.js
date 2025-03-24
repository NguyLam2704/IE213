import { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faUser, faSearch } from '@fortawesome/free-solid-svg-icons';
import "./Header.css"; 
import { useNavigate } from "react-router-dom";

export default function Header({ isAuthenticated, setIsAuthenticated }) {
  const [productDropdown, setProductDropdown] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsAuthenticated(false);
    navigate("/");
    localStorage.removeItem("isAuthenticated"); // Xóa dữ liệu đăng nhập
  };

  return (
    <header className="header" >
      {/* Logo + Home */}
      <div className="header-left">
        <Link to="/" className="logo">Smash Shop</Link>
        <Link to="/" className="nav-link">TRANG CHỦ</Link>
      </div>

      {/* Navigation */}
      <div 
        className="nav-dropdown"
        onMouseEnter={() => setProductDropdown(true)}
        onMouseLeave={() => setProductDropdown(false)}
      >
        <button
          className="dropdown-btn"
          onClick={() => navigate("/products")}
        >
            SẢN PHẨM         
        </button>
        {productDropdown && (
          <div className="dropdown-menu">
            {["VỢT CẦU LÔNG", "LƯỚI CẦU LÔNG", "GIÀY CẦU LÔNG", "QUẤN CÁN", "TÚI CẦU LÔNG"].map((item) => (
              <Link
                key={item}
                to={`/products/${item.toLowerCase().replace(/ /g, "-")}`}
                className="dropdown-item"
              >
                {item}
              </Link>
            ))}
          </div>
        )}
      </div>

      <Link to="/" className="nav-link">BÀI VIẾT</Link>
      
      {/* Search Bar */}
      <div className="search-bar">
        <input type="text" placeholder="Bạn đang tìm gì?" className="search-bar-input" />
        <FontAwesomeIcon icon={faSearch} className="search-icon" />
      </div>


      {/* Icons */}
      <div className="header-icons">
        <Link to="/cart">
          <FontAwesomeIcon icon={faCartShopping} className="icon" />
        </Link>

        {/* User Menu */}
        <div
          className="user-menu"
          onMouseEnter={() => setUserDropdown(true)}
          onMouseLeave={() => setUserDropdown(false)}
        >
          <FontAwesomeIcon icon={faUser} className="icon" />
          {userDropdown && (
          <div className="dropdown-menu user-dropdown user-dropdown-left">
            {isAuthenticated ? (
              <>
                <Link to="/user" className="dropdown-item">Thông tin cá nhân</Link>
                <button onClick={handleLogout} className="dropdown-item logout-btn">Đăng xuất</button>
              </>
            ) : (
              <>
                <Link to="/login" className="dropdown-item">Đăng nhập</Link>
                <Link to="/register" className="dropdown-item">Đăng ký</Link>
              </>
            )}
          </div>
        )}
        </div>
      </div>
    </header>
  );
}
