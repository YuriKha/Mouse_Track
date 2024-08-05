import React, { useState } from "react";
import "./Contactus.css";
import NavBar from "../NavBar/NavBar.js";
import SVGcontactus from "./SVGcontactus";
import axios from "axios";
import "./Model.css"

export default function Contactus(props) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [Email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [messageBody, setMessageBody] = useState("");

  //this is for the modelbox componant ============================
  const [modelClass, setModelClass] = useState(false);
  const toggleModle = () => {setModelClass(!modelClass)}
  //============================================================

  document.body.style.overflow = "hidden";
  const HandlerfirstName = (e) => {
    setFirstName(e.target.value);
  };
  const HandlerLastName = (e) => {
    setLastName(e.target.value);
  };
  const HandlerEmail = (e) => {
    setEmail(e.target.value);
  };
  const Handlertitle = (e) => {
    setTitle(e.target.value);
  };
  const HandlerBody = (e) => {
    setMessageBody(e.target.value);
  };
  const submitHanler = () => {
    //Changing the class for the modelbox
    const MessageData = {
      firstName: firstName,
      lastName: lastName,
      Email: Email,
      title: title,
      messageBody: messageBody,
    };
    console.log(MessageData);
    axios.post("http://localhost:3001/contactus/send", {
      MessageData: MessageData,
    });
    toggleModle()
  };
  return (
    <>
      <div className="contactus-container">
        <NavBar />
        <div className="left-side">
          <div className="fullname-inputs-box">
            <div className="omrs-input-group">
              <label className="omrs-input-underlined">
                <input required onChange={HandlerfirstName} />
                <span className="omrs-input-label">First Name</span>
              </label>
            </div>
            <div className="omrs-input-group">
              <label className="omrs-input-underlined">
                <input required onChange={HandlerLastName} />
                <span className="omrs-input-label">Last Name</span>
              </label>
            </div>
          </div>
          <div className="main-inputs-box">
            <div className="omrs-input-group">
              <label className="omrs-input-underlined">
                <input required onChange={HandlerEmail} />
                <span className="omrs-input-label">Email</span>
              </label>
            </div>
            <div className="omrs-input-group">
              <label className="omrs-input-underlined">
                <input required onChange={Handlertitle} />
                <span className="omrs-input-label">Message Title</span>
              </label>
            </div>
            <div className="textarea-box">
              <label htmlFor="textarea">Message Body</label>
              <textarea id="textarea" onChange={HandlerBody}></textarea>
            </div>
            <button
              type="submit"
              className="submit-button"
              onClick={submitHanler}
            >
              Submit
            </button>
          </div>
        </div>
        <div className="right-side">
          <h1 className="main-title">Contact Us</h1>
          <h2 className="right-side-title">How Can We Help?</h2>
          <p>
            Thank you for visiting our contact us page. Our goal is to provide
            the best customer service possible, and we are dedicated to
            responding to all inquiries in a timely and efficient manner.
            Whether you have a question about our products or services, or
            simply want to give us feedback, we would love to hear from you.
            Please fill out the form below, and we will get back to you as soon
            as possible. Thank you for your continued support!
          </p>
          <div className="svg">
            <SVGcontactus />
          </div>
        </div>
      </div>
      <Model toggleModle={toggleModle} modelClass={modelClass}/>
    </>
  );
}
function Model(props) {
  return (
    <>
      <div className={`model-backgroung ${props.modelClass ? "backgroung-open" : ""}`} onClick={props.toggleModle}></div>
      <div className={`model ${props.modelClass ? "model-open" : "model-close"}`}>Thanks for reaching out. We've received your message and will get back to you soon.</div>
    </>
  );
}
