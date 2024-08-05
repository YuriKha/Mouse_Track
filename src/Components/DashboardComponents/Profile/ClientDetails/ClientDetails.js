import "./ClientDetails.css";
import { FaUser } from "react-icons/fa";


export default function ClientDetails(props) {

  return (
    <div className="cd-container">
      <h1>Client Details</h1>
      <div className="cd-box">
        <div className="cd-right-side">
          <div className="cd-img">
            <FaUser />
          </div>
          <div className="cd-data">
            <h1>Name: {props.FullName}</h1>
            <span>Email: {props.Email}</span>
            <span>Phone: {props.Phone}</span>
          </div>
        </div>
        <div className="cd-website-data">
          <h4>Joined: {props.Joined}</h4>
          <h3>ID: {props.ID}</h3>
        </div>
      </div>
    </div>
  );
}
