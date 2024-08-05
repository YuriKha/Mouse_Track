import React, { useState, useEffect } from "react";
import "./HeatMapProperties.css";
import axios from "axios";
import { AiOutlineCalendar } from "react-icons/ai";
import { FaUser } from "react-icons/fa";
import TimeSelector from "../../TimeSelector/TimeSelector";
import { useLocation } from "react-router-dom";

export default function HeatMapProperties(props) {
  let location = useLocation(); //getting the data from url
  const [ID] = useState(() => {
    return new URLSearchParams(location.search).get("ID"); //getting the params "ID"
  });
  const [TimeSelectorFlag, setTimeSelectorFlag] = useState(false);
  const [adminFlag, setAdminFlag] = useState(false);
  const [UserName, setUserName] = useState();
  const [Websites, setWebsites] = useState([]);
  const [CurrentWebsite, setCurrentWebsite] = useState();
  const [Start, setStart] = useState("DD/MM/YYYY");
  const [End, setEnd] = useState("DD/MM/YYYY");
  const [storedToken] = useState(() => {
    for (const key of Object.keys(localStorage)) {
      if (key === "usertoken") {
        return localStorage.getItem("usertoken");
      } else if (key === "admintoken") {
        setAdminFlag(true);
        return localStorage.getItem("admintoken");
      }
    }
  });

  const checkTimeSelected = () => {
    if (checkTimeValidity(Start, End)) {
      setTimeSelectorFlag(false);
    }
  };

  useEffect(() => {
    var URL = "";
    if (adminFlag) {
      URL = "http://localhost:3001/mousetracker/getallwebmonitorforadmin";
    } else {
      URL = "http://localhost:3001/mousetracker/getallwebmonitor";
    }
    try {
      axios
        .post(URL, {
          storedToken: storedToken,
          ID: parseInt(ID),
        })
        .then((response) => {
          if (response.status === 200) {
            setWebsites(() => {
              return response.data.websitesArray;
            });
            setUserName(response.data.fullName);
            setCurrentWebsite(response.data.websitesArray[0]);
          }
        })
        .catch((error) => {
          setWebsites(["No Data Found"]);
        });
    } catch (error) {
      console.error("Error in useEffect:", error);
    }
  }, []);

  const clickHandler = () => {
    if (checkTimeValidity(Start, End)) {
      window.location.href = `/rawview?ID=${ID}&start=${Start}&end=${End}&website=${CurrentWebsite}`;
    }
  };
  return (
    <>
      <div className="bubble1"></div>
      <div className="bubble3"></div>
      <div className="heatmap-properties">
        <div className="properties-box">
          <h1>Properties</h1>
          <div className="properties-guieds">
            <h3>Welcome back, {UserName}!</h3>
            <p>
              Here, you can effortlessly access data for your chosen website. To
              get started, follow these simple steps:
            </p>
            <p>
              <span className="guieds-span">1</span>
              Select Your Date Range: Begin by clicking on the date field. A
              small window will appear, allowing you to pick your desired time
              frame. The left calendar sets the start date, and the right
              calendar determines the end date. For example, you can choose a
              range like "01/01/2022 – 01/02/2022."
            </p>
            <p>
              <span className="guieds-span">2</span>
              Choose the Website Page: In the next selection tab, you can
              specify which page of the website you'd like to explore. Please
              note that if you can't find a particular webpage, it may not be
              covered by your current payment plan. If you believe it should be
              included, feel free to reach out to us via our{" "}
              <a href="/contactus">Contact Us</a> page.
            </p>
            <p>
              <span className="guieds-span">3</span>
              View Your Data: Click the "See Data" button, and you'll be
              directed to the webpage you selected. There, you'll find all the
              data you're looking for.
            </p>
            <p>
              <span className="guieds-span">4</span>
              Remember, if you have any questions or need assistance, don't
              hesitate to contact us via our <a href="/contactus">
                Contact Us
              </a>{" "}
              page. We're here to help and will respond promptly to your
              inquiries.
            </p>
          </div>
          <div
            className="time-selected-box"
            onClick={() => setTimeSelectorFlag(!TimeSelectorFlag)}
          >
            <p>{Start}</p>
            <span>-</span>
            <p>{End}</p>
            <AiOutlineCalendar />
          </div>
          <div className="properties-selector">
            <select
              name="websites"
              id="websites"
              className="websites-selector"
              value={CurrentWebsite}
              onChange={(event) => {
                setCurrentWebsite(event.target.value);
              }}
            >
              {Websites.map((value, index) => {
                return (
                  <option value={value} key={index}>
                    {value}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="username-box">
            <div className="usericon-svg">
              <FaUser />
            </div>
            <p>{UserName}</p>
          </div>
          <button
            className="button-41"
            onClick={() => {
              clickHandler();
            }}
          >
            View WebSite
          </button>
        </div>
      </div>
      {TimeSelectorFlag ? (
        <TimeSelector
          setTimeSelectorFlag={setTimeSelectorFlag}
          checkTimeSelected={checkTimeSelected}
          setStart={setStart}
          setEnd={setEnd}
        />
      ) : null}
    </>
  );
}

function checkTimeValidity(startDate, endDate) {
  // Check if start date or end date is not empty
  if (startDate === "DD/MM/YYYY" || endDate === "DD/MM/YYYY") {
    alert("Please Select Time.");
    return false;
  }
  // Check if start date is after end date
  if (startDate > endDate) {
    alert("Start date cannot be after end date.");
    return false;
  }
  return true;
}
