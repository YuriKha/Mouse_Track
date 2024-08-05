import React, { useState } from "react";
import "./Signup.css";
import Logo from "../Logo/Logo.js";
import { FaHome } from "react-icons/fa";
import axios from "axios";

export default function Signup() {
  const [firstName, setfirstName] = useState();
  const [lastName, setlastName] = useState();
  const [email, setEmail] = useState();
  const [Phonenumber, setPhonenumber] = useState();
  const [Password, setPasswword] = useState();
  const [PasswordCon, setPasswordCon] = useState();
  const [errorMessage, setErrorMessage] = useState("");

  const signup = async (event) => {
    event.preventDefault();
    let data = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      Phonenumber: Phonenumber,
      Password: Password,
    };
    if (Password !== PasswordCon) {
      event.preventDefault();
      setErrorMessage("The passwords do not match");
      return;
    }
    await axios
      .post("http://localhost:3001/user/signup", { data: data })
      .then(() => {
        window.location.replace("/login");
      })
      .catch(function (error) {
        console.log(error.toJSON());
        if (error.toJSON().status === 409) {
          setErrorMessage("E-mail in use please try again");
        }
      });
  };

  return (
    <div>
      <div className="login-container">
        <div className="bubble-1"></div>
        <div className="bubble-2"></div>
        <div className="bubble-3"></div>
        <div className="bubble-front-2"></div>
        <div className="bubble-front-3"></div>
        <div className="login-navbar">
          <Logo />
          <a href="/">
            <FaHome />
          </a>
        </div>
        <div className="login-Page">
          <div className="backGround-bubble"></div>
          <div className="backGround-bubble2"></div>
          <div className="login-card signup">
            <h2>Signup</h2>
            <h3>Enter your credentials</h3>
            <div className="login-form">
              <input
                type="text"
                placeholder="First Name"
                onChange={(e) => {
                  setfirstName(e.target.value);
                }}
                value={firstName}
              />
              <input
                type="text"
                placeholder="Last Name"
                onChange={(e) => {
                  setlastName(e.target.value);
                }}
                value={lastName}
              />
              <input
                type="email"
                placeholder="Email"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                value={email}
                required
                title="This field is required"
              />
              <input
                type="number"
                placeholder="Phone"
                onChange={(e) => {
                  setPhonenumber(e.target.value);
                }}
                value={Phonenumber}
              />
              <input
                type="password"
                placeholder="Password"
                required
                title="This field is required"
                onChange={(e) => {
                  setPasswword(e.target.value);
                }}
                value={Password}
              />
              <input
                type="password"
                placeholder="Confirm Password"
                required
                title="This field is required"
                onChange={(e) => {
                  setPasswordCon(e.target.value);
                }}
                value={PasswordCon}
              />
              <button type="submit" onClick={signup}>
                Signup
              </button>
              {errorMessage && <p className="error-message">{errorMessage}</p>}
            </div>
            <p>
              Already have account? <a href="/login">Login</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
