import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import './AdminDashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGauge,
  faCartShopping,
  faPlus,
  faBox,
  faChartPie,
  faUser,
  faBars,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="ad-container">
      <header className="ad-header">
        <button className="ad-menu-btn" onClick={toggleSidebar}>
          <FontAwesomeIcon icon={sidebarOpen ? faXmark : faBars} />
        </button>
        ADMIN DASHBOARD
      </header>

      <div className="ad-body">
        <aside className={`ad-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <h2 className="ad-logo">Smash shop</h2>
          <nav className="ad-nav" onClick={closeSidebar}>
            <NavLink to="/admin" end className={({ isActive }) => isActive ? 'ad-nav-item active' : 'ad-nav-item'}>
              <FontAwesomeIcon icon={faGauge} /> Tổng quan
            </NavLink>
            <NavLink to="/admin/products" end className={({ isActive }) => isActive ? 'ad-nav-item active' : 'ad-nav-item'}>
              <FontAwesomeIcon icon={faBox} /> Sản phẩm hiện có
            </NavLink>
            <NavLink to="/admin/products/add" className={({ isActive }) => isActive ? 'ad-nav-item active' : 'ad-nav-item'}>
              <FontAwesomeIcon icon={faPlus} /> Thêm sản phẩm mới
            </NavLink>
            <NavLink to="/admin/orders" className={({ isActive }) => isActive ? 'ad-nav-item active' : 'ad-nav-item'}>
              <FontAwesomeIcon icon={faUser} /> Đơn hàng
            </NavLink>
          </nav>
        </aside>

        <main className="ad-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}