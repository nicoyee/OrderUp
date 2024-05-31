import './css/Landing.css';

import Header from "./LandingHeader";
import Navigation from "./LandingNavigation";
import Footer from "./LandingFooter";
import Loading from '../Loader';

import React, { useContext } from "react";
import { UserContext } from '../../../App';

const LandingPage = ({isLoggedIn}) => {
  
  const user = useContext(UserContext);

  return (
    <div id='landingContainer'>

      <Header />
      <Navigation />
      <Footer />

    </div>
  );
};

export default LandingPage;