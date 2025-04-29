import React from 'react';
import {
  faDollarSign,
  faBoxOpen,
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./AdminStatistics.css";


const AdminStatistics = () => {
  const data = [
    { date: "2025-04-02", revenue: 2000000, orders: 1, sold: 5 },
    { date: "2025-04-03", revenue: 4500000, orders: 2, sold: 7 },
    { date: "2025-04-04", revenue: 8700000, orders: 3, sold: 12 },
    { date: "2025-04-05", revenue: 14000000, orders: 4, sold: 15 },
    { date: "2025-04-06", revenue: 1200000, orders: 1, sold: 2 },
    { date: "2025-04-07", revenue: 0, orders: 0, sold: 0 },
    { date: "2025-04-08", revenue: 3500000, orders: 2, sold: 6 },
    { date: "2025-04-09", revenue: 8000000, orders: 3, sold: 8 },
    { date: "2025-04-10", revenue: 8000000, orders: 3, sold: 8 },
    { date: "2025-04-11", revenue: 8000000, orders: 3, sold: 8 },
    { date: "2025-04-12", revenue: 8000000, orders: 3, sold: 8 },
    { date: "2025-04-13", revenue: 5000000, orders: 3, sold: 8 },
    { date: "2025-04-14", revenue: 6000000, orders: 3, sold: 8 },
    { date: "2025-04-15", revenue: 8000000, orders: 3, sold: 8 },

  ];
  
  const StatCard = ({ title, value, change, icon, isDown = false }) => (
    <div className="stat-card">
      <div className="stat-left">
        <div className="stat-title">{title}</div>
        <div className="stat-value">{value.toLocaleString()}</div>
        <div className={`stat-change ${isDown ? "down" : "up"}`}>
          {isDown ? "▼" : "▲"} {Math.abs(change)}% so với hôm qua
        </div>
      </div>
      <div className="stat-icon">
          <FontAwesomeIcon icon={icon} />
        </div>
    </div>
  );

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      return (
        <div style={{ backgroundColor: "#fff", border: "1px solid #ccc", padding: 10 }}>
          <p><strong>Ngày:</strong> {label}</p>
          <p><strong>Doanh thu:</strong> {dataPoint.revenue.toLocaleString()} đ</p>
          <p><strong>Đơn hàng:</strong> {dataPoint.orders}</p>
          <p><strong>Sản phẩm đã bán:</strong> {dataPoint.sold}</p>
        </div>
      );
    }
    return null;
  };
  return (
    <div className="dashboard-container">
      <h2>Thống kê</h2>
      <div className="stat-cards">
        <StatCard title="Doanh thu" value={40689} change={8.5} icon={faDollarSign} />
        <StatCard title="Đơn hàng" value={30} change={8.5} icon={faCalendarAlt} />
        <StatCard title="Sản phẩm đã bán" value={499} change={-4.3} icon={faBoxOpen} isDown />
      </div>

      <h3>Thống kê doanh thu theo 365 ngày qua</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 20, right: 30, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis
            domain={[0, 'dataMax + 1000000']}
            tickFormatter={(value) =>
              value >= 1000000
                ? `${value / 1000000}tr`
                : value.toLocaleString()
            }
          />
          <Tooltip content={<CustomTooltip />} />
          <Line type="monotone" dataKey="revenue" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis
            domain={[0, 'dataMax + 1000000']}
            tickFormatter={(value) =>
              value >= 1000000
                ? `${value / 1000000}tr`
                : value.toLocaleString()
            }
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="revenue" fill="#00C49F" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AdminStatistics;
