import React from "react";
import "./ClientCode.css";
import { BsCodeSlash } from "react-icons/bs";
import CodeData from "./CodeData";

export default function ClientCode(props) {

  return (
    <div className="clientcode-container">
      <div className="cc-box">
        <div className="cc-header">
          <BsCodeSlash />
          <span>How to install HotZone on your site</span>
        </div>
        <div className="cc-code-box">
          <div className="cc-steps">
            <div className="cc-step-box">
              <div className="step-ball">1</div>
              <span>Copy this code.</span>
            </div>
            <div className="cc-code">
              <div className="cc-row-number">
                {Array.from({ length: 11 }, (_, i) => (
                  <span key={i}>{i + 1}</span>
                ))}
              </div>
              <CodeData ID={props.ID}/>
            </div>
            <div className="cc-step-box">
              <div className="step-ball">2</div>
              <span>
                Paste the code into the {"<head>"} of page to collect feedback.
              </span>
            </div>
            <div className="cc-step-box">
              <div className="step-ball">3</div>
              <span>Now, Let us do the work.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
