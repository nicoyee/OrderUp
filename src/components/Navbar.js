import '../css/Navbar.css';

import React, { useState, useEffect } from "react";
import { Link } from 'react-scroll';


const Navbar = ( {activeSection} ) => {

  const [isNavOpen, expandNav] = useState(false);

  return (
      <nav className="navbar">

        <ul>

          <li className={`${isNavOpen ? 'open' : ''} ${activeSection === "home" ? 'active' : ''} bump`}>
            <a href = "#home">home</a>
          </li>

          <li className={`${isNavOpen ? 'open' : ''} ${activeSection === "menu" ? 'active' : ''} bump`}>
            <a href = "#menu">menu</a>
          </li>

          <li className={`${isNavOpen ? 'open' : ''} ${activeSection === "events" ? 'active' : ''}`}>
            <a href = "#events">events</a>
          </li>
         
          <li className={`${isNavOpen ? 'open' : ''} ${activeSection === "concept" ? 'active' : ''}`}>
            <a href = "#concept">concept</a>
          </li>

        </ul>

        <div id="menuToggle">
          <input id="checkbox" type="checkbox" onClick={() => expandNav(!isNavOpen)} />
          <label className="toggle" htmlFor="checkbox">
            <div className="bar bar--top"></div>
            <div className="bar bar--middle"></div>
            <div className="bar bar--bottom"></div>
          </label>
        </div>
        
      </nav>
    );
};

export default Navbar;
