import './css/Landing.css';

import React, { useState, useEffect } from "react";
import { useMediaQuery } from 'react-responsive';

import Header from "./LandingHeader";
import Navigation from "./LandingNavigation";
import Footer from "./LandingFooter";
import Menu from "./Menu";
import Event from './Event';

const LandingPage = () => {

  const [landingContent, setLandingContent] = useState('navigation');

  return (
    <div id='landingContainer'>

      <Header />

      {landingContent === 'navigation' && (
        <Navigation setLandingContent={setLandingContent} />
      )}
      {landingContent === 'menu' && (  // Render Menu
        <Menu setLandingContent={setLandingContent} />
      )}
      {landingContent === 'event' && (  // Render EventPage as well
        <Event setLandingContent={setLandingContent} />
      )}

      <Footer />

    </div>
  );
};

export default LandingPage;
