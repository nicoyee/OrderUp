import './css/Landing.css';

import React, { useState, useEffect } from "react";
import { useMediaQuery } from 'react-responsive';

import Header from "./LandingHeader";
import Navigation from "./LandingNavigation";
import Footer from "./LandingFooter";
import Menu from "./Menu";

const LandingPage = () => {

  const [landingContent, setLandingContent] = useState('navigation');

  return (
    <div id='landingContainer'>

      <Header />

      { landingContent === 'navigation' && ( <Navigation setLandingContent={setLandingContent} /> ) }
      { landingContent === 'menu' && ( <Menu setLandingContent={setLandingContent} /> )}

      <Footer />

    </div>
  );
 
};

export default LandingPage;