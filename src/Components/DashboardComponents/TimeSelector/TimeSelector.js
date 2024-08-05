import React from "react";
import "./TimeSelector.css";
import { BsArrowRight } from "react-icons/bs";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export default function TimeSelector(props) {
  // Function to format a date as "dd/mm/yyyy"
  function formatDate(date) {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Note: Months are zero-indexed
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
  const handleClose = (event) => {
    props.setEnd("DD/MM/YYYY")
    props.setStart("DD/MM/YYYY")
    props.setTimeSelectorFlag(false)
  };
  return (
    <div className="timeselector-container">
      <div className="timeselector-mid-box">
        <div className="timeselector-topside">
          <span
            onClick={() => handleClose()}
            className="timeselector-close-button"
          >
            <AiOutlineCloseCircle />
          </span>
          <div className="timeselector-sidebox">
            <h2>Start</h2>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                onChange={(newValue) =>
                  props.setStart(formatDate(new Date(newValue.$d)))
                }
              />
            </LocalizationProvider>
          </div>
          <span className="timeselector-arrow">
            <BsArrowRight />
          </span>
          <div className="timeselector-sidebox">
            <h2>End</h2>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                onChange={(newValue) =>
                  props.setEnd(formatDate(new Date(newValue.$d)))
                }
              />
            </LocalizationProvider>
          </div>
        </div>
        <div className="timeselector-button">
          <button
            className="button-43"
            onClick={() => props.checkTimeSelected()}
          >
            Select Time
          </button>
        </div>
      </div>
    </div>
  );
}
