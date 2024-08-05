import React, { useEffect, useRef } from "react";
import "./WebView.css";

import h337 from "heatmap.js";

export default function WebView(props) {
  const heatmapContainerRef = useRef(null); // Use useRef for the container reference
  const heatmapInstanceRef = useRef(null);

  useEffect(() => {
    heatmapContainerRef.current.style.height = 1080 + "px";
  
    // Check if heatmapInstanceRef.current is null before creating a new instance
    if (heatmapContainerRef.current && !heatmapInstanceRef.current) {
      heatmapInstanceRef.current = h337.create({
        container: heatmapContainerRef.current,
        radius: 30,
        maxOpacity: 0.8,
      });
    }
  
    // Check if heatmapInstanceRef.current is not null before updating the data
    if (heatmapInstanceRef.current && props.HeatMapData) {
      heatmapInstanceRef.current.setData({
        max: 10,
        data: props.HeatMapData,
      });
    }
  }, [props.HeatMapData]);
  

  return <div ref={heatmapContainerRef} id="heatmapContainer"></div>;
}
