import React, { useState, useEffect } from "react";
import "./Profile.css";
import ClientDetails from "./ClientDetails/ClientDetails.js";
import ClientCode from "./ClientCode/ClientCode";
import { useLocation } from "react-router-dom";
import axios from "axios";

export default function Profile() {
  const [FullName, setFullName] = useState("");
  const [Email, setEmail] = useState("");
  const [Phone, setPhone] = useState("");
  const [Joined, setJoined] = useState("");
  const [Flag, setFlag] = useState(false);
  const [storedToken] = useState(() => {
    for (const key of Object.keys(localStorage)) {
      if (key === "usertoken") {
        return localStorage.getItem("usertoken");
      } else if (key === "admintoken") {
        setFlag(true);
        return localStorage.getItem("admintoken");
      }
    }
  });
  let location = useLocation(); //getting the data from url
  let ID = new URLSearchParams(location.search).get("ID"); //getting the params "ID"
  useEffect(() => {
    if (storedToken !== "") {
      async function getData() {
        var response;
        try {
          if (Flag) {
            response = await axios.get(
              `http://localhost:3001/adminmanagement/${ID}`,
              {
                params: {
                  params1: storedToken,
                },
              }
            );
          } else {
            response = await axios.post(
              `http://localhost:3001/usermanagement/VerifyUser`,
              {
                storedToken: storedToken,
              }
            );
          }
        } catch (error) {
          // Handle errors here
          console.error("Error fetching data:", error);
        }
        setFullName(
          "" + response.data.decoded.Fname + " " + response.data.decoded.Lname
        );
        setEmail("" + response.data.decoded.Email);
        setPhone("" + response.data.decoded.Phone);
        setJoined("" + response.data.decoded.Joined);
      }
      getData();
    }
  }, [storedToken, ID, Flag]);

  const clickHandler = () => {
    window.location.href = `/Dashboard/heatmap?ID=${ID}`;
  };
  return (
    <div className="DS-Profile-container">
      <div className="profile-box">
        <ClientDetails
          FullName={FullName}
          Email={Email}
          Phone={Phone}
          Joined={Joined}
          ID={ID}
        />
        <ClientCode ID={ID} />
        {Flag && (
          <div>
            <button className="button-41 " onClick={clickHandler}>
              View customer Webs
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
