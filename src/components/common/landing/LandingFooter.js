import './css/LandingFooter.css';

import React from "react";

const LandingFooter = () => {
  
  return (
    <div id='landingFooter'>

        <div className='landingFooter-left'>
            <a href="https://www.instagram.com/ugatfranchisehouse/" target="_blank" rel="noopener noreferrer">
                <h1>Ugat Franchise House</h1>
            </a>            
            <h2>La Guardia St.</h2>
            <h2>Lahug</h2>
            <h2>Cebu City 6000</h2>
        </div>

        <div className='landingFooter-right'>
            <h3><span>©</span>2023</h3>
        </div>

    </div>
  );
};

export default LandingFooter;