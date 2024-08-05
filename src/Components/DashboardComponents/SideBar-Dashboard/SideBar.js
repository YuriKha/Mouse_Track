import React, { useState } from "react";
import "./SideBar.css";
import { BiLogOut, BiHome } from "react-icons/bi";
import ClientSideBar from "./ClientSideBar/ClientSideBar";
import AdminSideBar from "./AdminSideBar/AdminSideBar";
import DashboardNavBar from "../Dashboard-NavBar/Dashboard-NavBar";

const Sidebar = () => {
  const [storedToken] = useState(() => {
    for (const key of Object.keys(localStorage)) {
      if (key === "usertoken") {
        return "usertoken";
      } else if (key === "admintoken") {
        return "admintoken";
      }
    }
  });
  return (
    <>
      <DashboardNavBar />
      <div className="sidebar">
        {storedToken === "admintoken" ? <AdminSideBar /> : <ClientSideBar />}
        <ul className="bottom-links">
          <li>
            <a href="/" className="dashboard-link-button">
              <i className="icon">
                <BiHome />
              </i>
              Home Page
            </a>
          </li>
          <li onClick={handelLogout}>
            <a href="/" className="dashboard-link-button">
              <i className="icon">
                <BiLogOut />
              </i>
              Log Out
            </a>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Sidebar;

function handelLogout() {
  for (let i = 0; i < localStorage.length; i++) {
    if (localStorage.key(i) === "usertoken") {
      localStorage.removeItem("usertoken");
    } else if (localStorage.key(i) === "admintoken") {
      localStorage.removeItem("admintoken");
    }
  }
  window.location.replace("/");
}
