import React from "react";
import "./HomePage.css";
import TopSection from "../TopSection/TopSection";
import FooterContainer from "../Footer/FooterContainer.js";
import Navbar from "../NavBar/NavBar.js";
import ReviwSection from "../ReviwSection/ReviwSection";

function HomePage() {
  return (
    <div className="home-container">
      <div className="backGround-bubble"></div>
      <div className="backGround-bubble2"></div>
      <Navbar />
      <TopSection />
      <ReviwSection/>
      <FooterContainer />
    </div>
  );
}

export default HomePage;
