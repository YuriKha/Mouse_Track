import React, { useState, useEffect } from "react";
import "./NavBar.css";
import Logo from "../Logo/Logo";
import { BiLogIn, BiUserPlus, BiLogOut } from "react-icons/bi";
import { FaUserAlt, FaRegUserCircle } from "react-icons/fa";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import { AiOutlineDatabase } from "react-icons/ai";
import axios from "axios";

export default function Navbar() {
  const [storedToken, setStoredToken] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [className, setClassName] = useState("");
  const [userConnectFlag, setUserConnectFlag] = useState(false);
  const [adminConnectFlag, setAdminConnectFlag] = useState(false);
  const [UserName, setUserName] = useState("");
  const [UserID, setUserID] = useState("");

  useEffect(() => {
    for (let i = 0; i < localStorage.length; i++) {
      if (localStorage.key(i) === "usertoken") {
        setStoredToken(() => {
          return localStorage.getItem("usertoken");
        });
        if (storedToken !== "") {
          checkToken("user");
        }
      } else if (localStorage.key(i) === "admintoken") {
        setStoredToken(() => {
          return localStorage.getItem("admintoken");
        });
        if (storedToken !== "") {
          checkToken("admin");
        }
      }
    }
    function checkToken(props) {
      var URL = "";
      props === "admin"
        ? (URL = "http://localhost:3001/adminmanagement/VerifyUser")
        : (URL = "http://localhost:3001/usermanagement/VerifyUser");
      axios
        .post(URL, { storedToken: storedToken })
        .then((response) => {
          if (response.data.decoded) {
            if (props === "admin") setAdminConnectFlag(true);
            setUserConnectFlag(true);
            setUserName("" + response.data.decoded.Fname);
            setUserID(response.data.decoded.ID);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }, [storedToken]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function handleScroll() {
    if (window.scrollY > 0) {
      setClassName("activenavbar");
    } else {
      setClassName("");
    }
  }

  const toggleNavbar = () => setIsOpen(!isOpen);

  return (
    <nav
      className={`navbar ${className}`}
      role="navigation"
      aria-label="main navigation"
    >
      <div className="navbar-brand">
        <a className="navbar-logo" href="/">
          <Logo />
        </a>
        <Burger toggleNavbar={toggleNavbar} />
      </div>
      <div className={`navbar-menu ${isOpen ? "menu-open" : ""}`}>
        <Burger isOpen={isOpen} toggleNavbar={toggleNavbar} />
        <div className="navbar-start">
          <a
            className={
              window.location.pathname === "/"
                ? "navbar-item button-active"
                : "navbar-item "
            }
            href="/"
          >
            Home
          </a>
          <a
            className={
              window.location.pathname === "/about"
                ? "navbar-item button-active"
                : "navbar-item "
            }
            href="/about"
          >
            About
          </a>
          <a
            className={
              window.location.pathname === "/contactus"
                ? "navbar-item button-active"
                : "navbar-item"
            }
            href="/contactus"
          >
            Contact us
          </a>
        </div>
        {userConnectFlag ? (
          <UserConnected
            UserID={UserID}
            UserName={UserName}
            adminConnectFlag={adminConnectFlag}
            setAdminConnectFlag={setAdminConnectFlag}
          />
        ) : (
          <NoUserFound />
        )}
      </div>
    </nav>
  );
}

function Burger(props) {
  return (
    <span
      role="button"
      className={`navbar-burger burger ${
        props.isOpen ? "navbar-open is-active" : ""
      }`}
      aria-label="menu"
      onClick={props.toggleNavbar}
    >
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
    </span>
  );
}
function NoUserFound() {
  return (
    <div className="navbar-end">
      <div>
        <div className="buttons">
          <a className="button is-light" href="/login">
            <BiLogIn />
            Login
          </a>
          <a className="button is-primary" href="/signup">
            <BiUserPlus />
            Create account
          </a>
        </div>
      </div>
    </div>
  );
}
function UserConnected(props) {
  const [profileOpen, setprofileOpen] = useState(false);
  const toggleprofile = () => setprofileOpen(!profileOpen);
  const handelLogout = () => {
    for (let i = 0; i < localStorage.length; i++) {
      if (localStorage.key(i) === "usertoken") {
        localStorage.removeItem("usertoken");
      } else if (localStorage.key(i) === "admintoken") {
        localStorage.removeItem("admintoken");
      }
    }
    props.setAdminConnectFlag(false);
    window.location.replace("/");
  };
  function clickHandler(e) {
    e.preventDefault();
    const params = new URLSearchParams();
    params.append("ID", props.UserID);
    const newUrl = `${window.location.origin}/Dashboard/profile?${params.toString()}`;
    window.location.href = newUrl;
  }
  return (
    <div className="connected-box">
      <FaUserAlt /> Welcome, {props.UserName}
      {!profileOpen ? (
        <TiArrowSortedDown className="arrow-down" onClick={toggleprofile} />
      ) : (
        <TiArrowSortedUp className="arrow-down" onClick={toggleprofile} />
      )}
      <div className={`connected-links-box ${profileOpen ? "box-open" : ""}`}>
        {!props.adminConnectFlag ? (
          <a href="/" onClick={(e) => clickHandler(e)}>
            <FaRegUserCircle />
            Profile
          </a>
        ) : (
          ""
        )}
        {props.adminConnectFlag ? (
          <a href="/Dashboard/customers">
            <AiOutlineDatabase />
            Dashboard
          </a>
        ) : (
          ""
        )}
        <button className="logout" onClick={handelLogout}>
          <BiLogOut />
          logout
        </button>
      </div>
    </div>
  );
}
