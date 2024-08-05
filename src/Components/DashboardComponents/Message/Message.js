import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./Message.css";
import axios from "axios";
import { FaRegWindowClose, FaRegStar } from "react-icons/fa";
import MessageFlow from "./MessageFlow/MessageFlow";

export default function Message() {
  const [FullName, setFullName] = useState("");
  const [Email, setEmail] = useState("");
  const [MessageID, setMessageID] = useState();
  const [ClientID, setClientID] = useState();
  const [Received, setReceived] = useState();
  const [Status, setStatus] = useState();
  const [Important, setImportant] = useState();
  const [Title, setTitle] = useState();
  const [MessageBody, setMessageBody] = useState();
  const [storedToken] = useState(() => {
    return localStorage.getItem("admintoken");
  });
  let location = useLocation(); //getting the data from url
  let ID = new URLSearchParams(location.search).get("ID"); //getting the params "ID"
  useEffect(() => {
    if (storedToken !== "") {
      getData(storedToken);
    }
  }, []);
  function getData() {
    axios
      .get(`http://localhost:3001/contactadmin/${ID}`, {
        params: {
          params1: storedToken,
        },
      })
      .then((response) => {
        setTitle(response.data.contactfound[0].Title);
        setMessageBody(response.data.contactfound[0].Details);
        setClientID(response.data.contactfound[0].ClientID);
        setMessageID(response.data.contactfound[0].ID);
        setEmail(response.data.contactfound[0].Email);
        setReceived(response.data.contactfound[0].Received);
        setStatus(() =>
          response.data.contactfound[0].Status ? "Open" : "Close"
        );
        setImportant(() =>
          response.data.contactfound[0].Important ? "True" : "False"
        );
        setFullName(
          response.data.contactfound[0].Fname +
            " " +
            response.data.contactfound[0].Lname
        );
      });
  }

  return (
    <>
      <div className="dashboard-message-container">
        <div className="message-main-page">
          <h1 className="">Customer Message Details</h1>
          <div className="message-letter">
            <div className="cc-code-box-id">Message ID: {MessageID}</div>
            <div className="message-letter-body">
              <div className="message-client-details m-25">
                <h4>Name : {FullName}</h4>
                <h4>Email : {Email}</h4>
                <h4>Client ID : {ClientID}</h4>
                <h4>Message Status : {Status}</h4>
                <h4>Message Important : {Important}</h4>
                <h4>Received at : {Received}</h4>
              </div>
              <div className="message-desc m-25">
                <h2 className="m-25">{Title}</h2>
                <p>{MessageBody}</p>
              </div>
            </div>
            <FunctionBox
              Status={Status}
              storedToken={storedToken}
              ID={ID}
              Important={Important}
            />
          </div>
        </div>
      </div>
      <MessageFlow ID={ID} storedToken={storedToken} />
    </>
  );
}
function FunctionBox(props) {
  function CloseHandler() {
    axios
      .delete(`http://localhost:3001/contactadmin/${props.ID}`, {
        params: {
          params1: props.storedToken,
        },
      })
      .then(() => {
        window.location.href = "/Dashboard/contactus";
      });
  }
  function ToggleImportant() {
    axios
      .get(`http://localhost:3001/contactadmin/toggleimportant/${props.ID}`, {
        params: {
          params1: props.storedToken,
        },
      })
      .then(() => {
        window.location.href = "/Dashboard/contactus";
      });
  }
  return (
    <div className="function-box">
      {props.Important === "False" ? (
        <button className="button-41" onClick={ToggleImportant}>
          <FaRegStar /> Set As Important
        </button>
      ) : (
        <button className="button-42" onClick={ToggleImportant}>
          <FaRegStar /> Set As Not Important
        </button>
      )}
      {props.Status === "Open" ? (
        <button className="button-42" onClick={CloseHandler}>
          <FaRegWindowClose /> Close Message
        </button>
      ) : null}
    </div>
  );
}
