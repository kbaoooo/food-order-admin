import React from "react";
import "./Sidebar.css";
import { assets } from "../../assets/assets";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-options">
        <NavLink to="/dashboard" className="sidebar-option">
          <img src={assets.dashboard} alt="" />
          <p>Dashboard</p>
        </NavLink>
        <NavLink to="/add" className="sidebar-option">
          <img src={assets.add_icon} alt="" />
          <p>Thêm món</p>
        </NavLink>
        <NavLink to="/list" className="sidebar-option">
          <img src={assets.order_icon} alt="" />
          <p>Danh sách món ăn</p>
        </NavLink>
        <NavLink to="/orders" className="sidebar-option">
          <img src={assets.orders} alt="" />
          <p>Đơn hàng</p>
        </NavLink>
        <NavLink to="/vouchers" className="sidebar-option">
          <img src={assets.voucher} alt="" />
          <p>Ưu đãi</p>
        </NavLink>
        <NavLink to="/manage-users" className="sidebar-option">
          <img src={assets.people} alt="" />
          <p>Quản lý thành viên</p>
        </NavLink>
      </div>
    </div>
  );
}
