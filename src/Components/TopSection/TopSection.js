import React, { useState, useEffect } from "react";
import "./TopSection.css";
import axios from "axios";

export default function TopSection() {
  const [storedToken, setStoredToken] = useState("");

  useEffect(() => {
    if (storedToken !== "") {
      checkToken("user");
    }
  }, [storedToken]);

  const clickHandler = () => {
    var flag = false;
    for (let i = 0; i < localStorage.length; i++) {
      if (localStorage.key(i) === "usertoken") {
        const token = localStorage.getItem("usertoken");
        setStoredToken(token);
        flag = true;
      } else if (localStorage.key(i) === "admintoken") {
        window.location.href = "/Dashboard/customers";
        flag = true;
      }
    }
    if (!flag) {
      window.location.href = "/login";
    }
  };

  function checkToken(props) {
    const URL =
      props === "admin"
        ? "http://localhost:3001/adminmanagement/VerifyUser"
        : "http://localhost:3001/usermanagement/VerifyUser";

    axios
      .post(URL, { storedToken })
      .then((response) => {
        if (response.data.decoded) {
          window.location.href = `/Dashboard/profile?ID=${response.data.decoded.ID}`;
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  return (
    <div className="top-box">
      <div className="text-side">
        <h1>Together</h1> <h2>we will bring the</h2>
        <br /> <h1>Best</h1> <h2>user</h2> <h1>Experience</h1>{" "}
        <h2>to your website</h2>
        <button
          className="text-side-button"
          onClick={clickHandler}
        >
          Get started
        </button>
      </div>
      <div className="img-side">
        <img src={require("../SvghomePage/HomePageSVG.png")} alt="svg"></img>
      </div>
    </div>
  );
}
