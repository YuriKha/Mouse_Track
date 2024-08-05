import React, { useState, useEffect, useRef } from "react";
import "./HeatMapRawView.css";
import axios from "axios";
import Loading from "../Loading/Loading";
import WebView from "../../../WebView/WebView";
import { useLocation } from "react-router-dom";
import { AiOutlineArrowDown, AiOutlineArrowUp } from "react-icons/ai";

export default function HeatMapRawView() {
  const [HeatMapData, setHeatMapData] = useState(null);
  const [arrowFlag, setArrowFlag] = useState(false);
  const location = useLocation(); //getting the data from url
  const [ID] = useState(() => {
    return new URLSearchParams(location.search).get("ID");
  });
  const [StartDate] = useState(() => {
    return new URLSearchParams(location.search).get("start");
  });
  const [EndDate] = useState(() => {
    return new URLSearchParams(location.search).get("end");
  });
  const [WebSite] = useState(() => {
    return new URLSearchParams(location.search).get("website");
  });
  const [storedToken] = useState(() => {
    for (const key of Object.keys(localStorage)) {
      if (key === "usertoken") {
        return localStorage.getItem("usertoken");
      } else if (key === "admintoken") {
        return localStorage.getItem("admintoken");
      }
    }
  });
  const splitName = WebSite.split("/");
  const shortWebsiteName = splitName[0] + "//" + splitName[2];

  const [img, setImg] = useState(null);
  const [loading, setLoading] = useState(false);

  const WindowContainerRef = useRef(null);

  useEffect(() => {
    if (img !== null) {
      // Fetch heatmap data and initialize the heatmap component
      getHeatMap();
    }
  }, [img]);

  const clickhandler = () => {
    if (WebSite) {
      setLoading(true);
      axios({
        method: "post",
        url: "https://hot-zone-screenshot.onrender.com/screenshot/takescreenshot",
        data: { website: WebSite },
        responseType: "blob",
      })
        .then((response) => {
          const imageUrl = URL.createObjectURL(response.data);
          setImg(imageUrl);
          setLoading(false);
        })
        .then(getHeatMap)
        .catch((error) => {
          console.error("Error in useEffect:", error);
          setLoading(false);
        });
    }
  };

  const getHeatMap = () => {
    const requestData = {
      website: WebSite,
      storedToken: storedToken,
      startDate: StartDate,
      endDate: EndDate,
      ClientID: parseInt(ID),
    };
    axios
      .post("http://localhost:3001/mousetracker/gettrackbydata", requestData)
      .then((response) => {
        setHeatMapData(response.data.newMoves);
      })
      .catch((error) => {
        console.error("Error in useEffect:", error);
      });
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      {/* =======================Model Box===================== */}
      <div className={arrowFlag ? "rawview-model " : "rawview-model model-up"}>
        <div className="model-text">
          <div>
            <h4>Client ID:</h4>
            {ID}
          </div>
          <div>
            <h4>Dates:</h4>
            {StartDate} - {EndDate}
          </div>
          <div>
            <h4>WebSite:</h4>
            {shortWebsiteName}
          </div>
        </div>
        <div
          className="model-arrow"
          onClick={() => {
            setArrowFlag(!arrowFlag);
          }}
        >
          {!arrowFlag ? <AiOutlineArrowDown /> : <AiOutlineArrowUp />}
        </div>
      </div>
      {/* =======================Model Box===================== */}
      <button className="button-41 top" onClick={clickhandler}>
        See Website
      </button>
      <div className="rawview-container">
        <img
          src={img}
          alt="screenshot"
          ref={WindowContainerRef}
        />
        <div className="heatmap-webview-container">
          {img !== null && (
            <WebView
              storedToken={storedToken}
              ClientID={ID}
              website={WebSite}
              startDate={StartDate}
              endDate={EndDate}
              HeatMapData={HeatMapData}
            />
          )}
        </div>
      </div>
    </>
  );
}
