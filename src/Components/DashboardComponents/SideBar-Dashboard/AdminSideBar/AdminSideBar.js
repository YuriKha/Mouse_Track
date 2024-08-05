import React from "react";
import { FaUsers } from "react-icons/fa";
import { AiOutlineMessage } from "react-icons/ai";

export default function AdminSideBar() {
  return (
    <ul className="sidebar-links">
      <li>
        <a
          className={
            window.location.pathname === "/Dashboard/customers"
              ? "dashboard-link-button active-button"
              : "dashboard-link-button"
          }
          href="/Dashboard/customers"
        >
          <i className="icon">
            <FaUsers />
          </i>{" "}
          Customers
        </a>
      </li>
      <li>
        <a
          className={
            window.location.pathname === "/Dashboard/contactus"
              ? "dashboard-link-button active-button"
              : "dashboard-link-button"
          }
          href="/Dashboard/contactus"
        >
          <i className="icon">
            <AiOutlineMessage />
          </i>{" "}
          Contact Us
        </a>
      </li>
    </ul>
  );
}
