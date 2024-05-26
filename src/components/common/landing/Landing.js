import './css/Landing.css';

import React, { useState, useEffect } from "react";

import Header from "./LandingHeader";
import Navigation from "./LandingNavigation";
import Footer from "./LandingFooter";

const LandingPage = () => {
  
  return (
    <div id='landingContainer'>

      <Header />
      <Navigation />
      <Footer />

    </div>
  );
};

export default LandingPage;