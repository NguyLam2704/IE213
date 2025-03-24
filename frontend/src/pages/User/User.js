import Header from "../../components/Header/Header";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faClipboardList, faLock, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { Link, Outlet, useLocation, useNavigate, Navigate } from "react-router-dom";
import "./User.css";

export default function User({ isAuthenticated, setIsAuthenticated }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false); // State hiển thị modal

  if (location.pathname === "/user") {
    return <Navigate to="/user/profile" replace />;
  }

  // Danh sách menu sidebar
  const menuItems = [
    { label: "Thông tin tài khoản", icon: faUser, path: "/user/profile" },
    { label: "Đơn hàng đã đặt", icon: faClipboardList, path: "/user/orders" },
    { label: "Đổi mật khẩu", icon: faLock, path: "/user/change-password" },
    { label: "Đăng xuất", icon: faSignOutAlt, path: "#" }, // Không điều hướng ngay
  ];

  // Hàm xử lý đăng xuất
  const handleLogout = () => {
    setIsAuthenticated(false);
    navigate("/");
    localStorage.removeItem("isAuthenticated");
  };

  return (
    <>
      <Header isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated}/>

      <div className="user-container">
        <div className="user-header-container">
          <p className="user-header">TRANG CHỦ {'>'} TRANG CÁ NHÂN</p>
        </div>

        {/* Sidebar */}
        <div className="user-body">
          <div className="sidebar">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className={`sidebar-item ${location.pathname === item.path ? "active" : ""}`}
                onClick={item.label === "Đăng xuất" ? (e) => { 
                  e.preventDefault(); 
                  setShowLogoutModal(true);
                } : null}
              >
                <FontAwesomeIcon icon={item.icon} className="sidebar-icon" />
                {item.label}
              </Link>
            ))}
          </div>

          {/* Nội dung chi tiết */}
          <div className="user-content">
            <Outlet />
          </div>
        </div>
      </div>

      {/* Modal xác nhận đăng xuất */}
      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="modal">
            <p>Bạn có chắc chắn muốn đăng xuất?</p>
            <div className="modal-buttons">
              <button className="modal-btn confirm" onClick={handleLogout}>Đăng xuất</button>
              <button className="modal-btn cancel" onClick={() => setShowLogoutModal(false)}>Hủy</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
