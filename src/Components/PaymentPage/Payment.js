import React from "react";
import "./Payment.css";
import { PlansData } from "./Payment-plans";
import { FaDollarSign } from "react-icons/fa";

export default function Payment() {
  return (
    <div className="page-container">
      <div className="bubble-1"></div>
      <div className="bubble-2"></div>
      <div className="bubble-3"></div>
      <div className="bubble-front-1"></div>
      <div className="bubble-front-2"></div>
      <div className="bubble-front-3"></div>
      <div className="cards-container">
        {PlansData.map((props, index) => {
          return (
            <div className={`card-plan-${index} center`}>
              <div className="card-top-text center">
                <h1>{props.plan}</h1>
                <p>{props.Header}</p>
              </div>
              <div className="card-price">
                <span className="dollar-sign">
                  <FaDollarSign />
                </span>
                <span className="amount-sign">{props.Price}</span>
                <span className="text-sign">PER MONTH</span>
              </div>
              <div className="card-desc-text">
                <p>{props.Desc}</p>
              </div>
              <div className="card-button">
                <button className="card-button-select">SELECT</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
