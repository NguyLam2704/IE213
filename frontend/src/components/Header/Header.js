import { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faUser, faSearch } from '@fortawesome/free-solid-svg-icons';
import "./Header.css"; 
import { useNavigate } from "react-router-dom";
import { selectTotalQuantity } from '../../../src/app/store/selectors.js';
import { useDispatch, useSelector } from "react-redux";
import { setSearchTerm, clearSearchTerm } from "../../features/search/searchSlice";
import { useGetProductsQuery } from "../../features/product/productApi";
// import logo from "../../assets/Logo2-long.png"

export default function Header({ isAuthenticated, setIsAuthenticated }) {
  const count = useSelector(state => state.cart.items.length);
  // SEARCH BAR
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: allProducts = [] } = useGetProductsQuery(); // lấy tất cả sản phẩm
  const searchTerm = useSelector((state) => state.search.searchTerm);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleInputChange = (e) => {
    dispatch(setSearchTerm(e.target.value));
    setShowDropdown(true);
  };

  const handleSelectProduct = (productId) => {
    dispatch(clearSearchTerm());
    navigate(`/product/${productId}`);
    setShowDropdown(false);
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      setShowDropdown(false);
      navigate(`/products?search=${searchTerm}`);
    }
  };

   // Lọc sản phẩm theo tên
  const filteredProducts = allProducts.filter((p) =>
    p.prod_name.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 5); // giới hạn 5 kết quả

  const [productDropdown, setProductDropdown] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);

  // LOGOUT
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
        {/* <Link to="/" className="logo-img"><img src={logo}/></Link> */}
        <Link to="/" className="nav-link">TRANG CHỦ</Link>
      </div>

      {/* Navigation */}
      <div 
        className="nav-dropdown "
        onMouseEnter={() => setProductDropdown(true)}
        onMouseLeave={() => setProductDropdown(false)}
      >
        <button
          className="dropdown-btn nav-link"
          onClick={() => navigate("/products")}
        >
            SẢN PHẨM         
        </button>
        {productDropdown && (
          <div className="dropdown-menu">
            {["Vợt cầu lông", "Lưới cầu lông", "Giày cầu lông", "Quấn cán", "Túi cầu lông"].map((item) => (
              <Link
                key={item}
                to={`/products/${item}`}
                className="dropdown-item"
              >
                {item}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* <Link to="/" className="nav-link">BÀI VIẾT</Link> */}
      
      {/* Search Bar */}
      <div className="search-bar">
        <input 
          type="text" 
          placeholder="Bạn đang tìm gì?" 
          className="search-bar-input" 
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleEnter}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)} // delay để click chọn không bị mất dropdown
          onFocus={() => searchTerm && setShowDropdown(true)}
        />
        <FontAwesomeIcon icon={faSearch} className="search-icon"  onClick={() => handleEnter({ key: "Enter" })}/>
        {showDropdown && searchTerm && (
          <div className="search-dropdown">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className="dropdown-item"
                onClick={() => handleSelectProduct(product._id)}
              >
                <img
                  src={`${product.images.filter((img) => img.is_primary_image)[0]?.image}`}
                  alt={product.prod_name}
                  className="search-product-image"
                />
                <span className="search-product-name">{product.prod_name}</span>
              </div>
            ))}
          </div>
        )}
      </div>


      {/* Icons */}
      <div className="header-icons">
        <Link to="/cart" className="cart-link">
          <FontAwesomeIcon icon={faCartShopping} className="icon" />
          {count > 0 && (
            <span className="cart-badge">{count}</span>
          )}
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
