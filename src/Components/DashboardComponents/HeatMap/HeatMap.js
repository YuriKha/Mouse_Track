import React, { useState, useEffect } from "react";
import "./HeatMap.css";
import HeatMapProperties from "./HeatMapProperties/HeatMapProperties";
import HeatMapRawView from "./HeatMapRawView/HeatMapRawView";
import Loading from "./Loading/Loading";
import axios from "axios";

export default function HeatMap() {
  
  
  
  return (
    <div className="heatmap-container">
      <HeatMapProperties
      />
    </div>
  );
}
{/* <HeatMapRawView
  CurrentWebsite={CurrentWebsite}
  HeatMapData={HeatMapData}
/> */}
