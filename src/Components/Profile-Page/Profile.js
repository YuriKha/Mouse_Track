import React, { useState, useEffect } from "react";
import "./Profile.css";
import { useLocation } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import BarChart from "../Charts/BarChart/BarChart";
import LineChart from "../Charts/LineChart/LineChart";
import { UserData } from "../Charts/DemoData.js";
import WebView from "../WebView/WebView";
import axios from "axios";

export default function Profile() {
  const [storedToken] = useState(() => {
    return localStorage.getItem("admintoken");
  });
  const [FullName, setFullName] = useState("");
  const [Email, setEmail] = useState("");
  const [Phone, setPhone] = useState("");
  let location = useLocation(); //getting the data from url
  let ID = new URLSearchParams(location.search).get("ID"); //getting the params "ID"
  useEffect(() => {
    if (storedToken !== "") {
      getData(storedToken);
    }
  }, []);

  function getData() {
    axios
      .get(`http://localhost:3001/adminmanagement/${ID}`, {
        params: {
          params1: storedToken,
        },
      })
      .then((response) => {
        setFullName(
          "" +
            response.data.userfound[0].Fname +
            " " +
            response.data.userfound[0].Lname
        );
        setEmail("" + response.data.userfound[0].Email);
        setPhone("" + response.data.userfound[0].Phone);
      });
  }

  const [userData] = useState({
    labels: UserData.map((data) => data.year),
    datasets: [
      {
        label: "Users Gained",
        data: UserData.map((data) => data.userGain),
        backgroundColor: [
          "rgba(75,192,192,1)",
          "#ecf0f1",
          "#50AF95",
          "#f3ba2f",
          "#2a71d0",
        ],
        borderColor: "black",
        borderWidth: 2,
      },
    ],
  });

  return (
    <div className="profile-container">
      <div className="client-data-side">
        <div className="client-card">
          <div className="client-img">
            <FaUser />
          </div>
          <div className="client-data">
            <span>{FullName}</span>
            <span>{Email}</span>
            <span>{Phone}</span>
            <span>ID : {ID}</span>
          </div>
          <div className="client-web-data">
            <label htmlFor="websits">Show Website:</label>
            <select name="websits" id="websits" className="web-selector">
              <option value="www.google.com">www.google.com</option>
              <option value="www.youtube.com">www.youtube.com</option>
              <option value="www.facebook.com">www.facebook.com</option>
              <option value="www.linkedin.com">www.linkedin.com</option>
            </select>
          </div>
          <div className="client-buttons">
            <button className="client-button">Contact Us</button>
            <button className="client-button logout">LogOut</button>
          </div>
        </div>
      </div>
      {/* <div className="data-side">
        <div style={{ width: 700 }} className="bar-chart">
          <BarChart chartData={userData} />
        </div>
        <div style={{ width: 700 }} className="bar-chart">
          <LineChart chartData={userData} />
        </div>
      </div> */}
      <div className="heatmap-container">
        <WebView />
      </div>
      {/* <WebView/> */}
    </div>
  );
}
