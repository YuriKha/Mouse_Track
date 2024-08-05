import React, { useState, useEffect } from "react";
import { FaUsers, FaSearch } from "react-icons/fa";
import { MdWeb } from "react-icons/md";
import axios from "axios";

export default function ClientSideBar() {
  const [ID, setID] = useState("");

  useEffect(() => {
    const storedToken =
      localStorage.getItem("usertoken") || localStorage.getItem("admintoken");

    if (storedToken) {
      axios
        .post(`http://localhost:3001/usermanagement/VerifyUser`, {
          storedToken: storedToken,
        })
        .then((response) => {
          if (response.data.decoded) {
            setID(response.data.decoded.ID);
          }
        });
    }
  }, []);

  return (
    <ul className="sidebar-links">
      <li>
        <a
          className={
            window.location.pathname === "/Dashboard/profile"
              ? "dashboard-link-button active-button"
              : "dashboard-link-button"
          }
          href={`/Dashboard/profile?ID=${ID}`}
        >
          <i className="icon">
            <FaUsers />
          </i>{" "}
          Profile
        </a>
      </li>
      {/* <li>
        <a
          className={
            window.location.pathname === "/Dashboard/contactus"
              ? "dashboard-link-button active-button"
              : "dashboard-link-button"
          }
          href="/Dashboard/contactus"
        >
          <i className="icon">
            <MdWeb />
          </i>{" "}
          My Websites
        </a>
      </li> */}
      <li>
        <a
          className={
            window.location.pathname === "/Dashboard/heatmap"
              ? "dashboard-link-button active-button"
              : "dashboard-link-button"
          }
          href={`/Dashboard/heatmap?ID=${ID}`}
        >
          <i className="icon">
            <FaSearch />
          </i>{" "}
          Heat Map
        </a>
      </li>
    </ul>
  );
}
