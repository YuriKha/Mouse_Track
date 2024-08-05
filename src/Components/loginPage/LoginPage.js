import React, { useState, useRef } from "react";
import "./LoginPage.css";
import Logo from "../Logo/Logo.js";
import { FaHome } from "react-icons/fa";
import axios from "axios";

export default function LoginPage() {
  const [userName, setuserName] = useState();
  const [Password, setPasswword] = useState();
  const [ErrorFlag, setErrorFlag] = useState(false);
  const UserNameRef = useRef();
  const PassWordRef = useRef();
  const Register = () => {
    setErrorFlag(false);
    axios
      .post("http://localhost:3001/user/login", {
        userName: userName,
        Password: Password,
      })
      .then((response) => {
        if (response.data.usertoken) {
          localStorage.setItem("usertoken", response.data.usertoken);
          window.location.replace("/");
        } else if (response.data.admintoken) {
          localStorage.setItem("admintoken", response.data.admintoken);
          window.location.replace("/");
        }
      })
      .catch(function (error) {
        setErrorFlag(true);
        UserNameRef.current.style.borderColor = "red";
        PassWordRef.current.style.borderColor = "red";
        console.log(error.toJSON());
      });
  };

  return (
    <div className="login-container">
      <div className="login-navbar">
        <Logo />
        <a href="/">
          <FaHome />
        </a>
      </div>
      <div className="bubble-1"></div>
      <div className="bubble-2"></div>
      <div className="bubble-3"></div>
      <div className="bubble-front-1"></div>
      <div className="bubble-front-2"></div>
      <div className="bubble-front-3"></div>
      <div className="login-Page">
        <div className="login-card">
          <h2>Login</h2>
          <h3>Enter your credentials</h3>
          <div className="login-form">
            <input
              type="text"
              placeholder="Email"
              ref={UserNameRef}
              onChange={(e) => {
                setuserName(e.target.value);
              }}
            />
            <input
              type="password"
              placeholder="Password"
              ref={PassWordRef}
              onChange={(e) => {
                setPasswword(e.target.value);
              }}
            />
            {ErrorFlag ? (
              <span className="error-message">
                Please Check Email / Password.
              </span>
            ) : null}

            <a href="#">Forgot your password?</a>
            <button onClick={Register}>LOGIN</button>
          </div>
          <p>
            Don't have accuont? <a href="/signup">Sign-up</a>
          </p>
        </div>
      </div>
    </div>
  );
}
