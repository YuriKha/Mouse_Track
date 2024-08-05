import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../SideBar-Dashboard/SideBar.js";
import "./Dashboard.css";

export default function Dashboard() {
  return (
    <div className="Dashboard-container">
      <Sidebar />
      <div className="Dashboard-main-side">
        <Outlet />
      </div>
    </div>
  );
}
