import React, { useState, useEffect } from "react";
import "./MessageFlow.css";
import axios from "axios";
import { AiOutlinePlus } from "react-icons/ai";
import { GiCancel } from "react-icons/gi";

export default function MessageFlow(props) {
  const [DataFlow, setDataFlow] = useState([]);
  const [BoxModleHandler, setBoxModleHandler] = useState(false);
  useEffect(() => {
    if (props.storedToken !== "") {
      getData(props.storedToken);
    }
  }, []);
  function getData() {
    axios
      .get(`http://localhost:3001/contactadmin/customerflowbyid/${props.ID}`, {
        params: {
          params1: props.storedToken,
        },
      })
      .then((response) => {
        setDataFlow(response.data.CustemerFlow);
      });
  }
  return (
    <div className="mf-container">
      {BoxModleHandler ? (
        <BoxModel
          setBoxModleHandler={setBoxModleHandler}
          setDataFlow={setDataFlow}
          DataFlow={DataFlow}
          BoxModleHandler={BoxModleHandler}
          ID={props.ID}
          storedToken={props.storedToken}
        />
      ) : null}
      <div className="mf-main-body">
        <h1 className="">Customer Messages Flow</h1>
        {DataFlow.length === 0 ? (
          <NoMessageBox />
        ) : (
          DataFlow.map((props, index) => (
            <MessageBox
              key={index}
              Message={props.Message}
              Date={props.Date}
              Time={props.Time}
            />
          ))
        )}
        <button
          className="button-41"
          onClick={() => setBoxModleHandler(!BoxModleHandler)}
        >
          <AiOutlinePlus /> Add New
        </button>
      </div>
    </div>
  );
}
function BoxModel(props) {
  const [message, setMessage] = useState("");
  //This is a componant if the user wants to add new flow
  function AddNewHandler(ID) {
    axios
      .post(`http://localhost:3001/contactadmin/updatecustomerflow/${ID}`, {
        storedToken: props.storedToken,
        string: message,
      })
      .then((response) => {
        window.location.reload();
      });
  }
  return (
    <div className="bm-container">
      <div className="bm-model">
        <h1>Please Write in very Details the message</h1>
        <div className="bm-message">
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
          />
        </div>
        <div className="bm-buttons">
          <button className="button-41" onClick={() => AddNewHandler(props.ID)}>
            <AiOutlinePlus /> Add New
          </button>
          <button
            className="button-42"
            onClick={() => props.setBoxModleHandler(!props.BoxModleHandler)}
          >
            <GiCancel /> Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
//This is a componant if there is flow
function MessageBox(props) {
  return (
    <div className="mf-message-box">
      <div className="mf-message-box-side">
        <h2 className="centertext">Message</h2>
        <p>{props.Message}</p>
      </div>
      <div className="mf-time-box-side">
        <h2 className="centertext">Time</h2>
        <h4>{props.Date}</h4>
        <h4>{props.Time}</h4>
      </div>
    </div>
  );
}
//This is a componant if there is no flow
function NoMessageBox() {
  return (
    <div className="mf-message-box">
      <h2 className="centertext w-100">There is no Data</h2>
    </div>
  );
}
