import React, { useState, useEffect } from "react";
import { Link } from 'react-scroll';
import '../css/Navbar.css';

const Navbar = ( {activeSection} ) => {

  const [isNavOpen, expandNav] = useState(false);

  return (
      <nav className="navbar">

        <ul>

          <li className={`${isNavOpen ? 'open' : ''} ${activeSection === "home" ? 'active' : ''}`}>
            <a href = "#home">home</a>
          </li>

          <li className={`${isNavOpen ? 'open' : ''} ${activeSection === "menu" ? 'active' : ''}`}>
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
          <label class="toggle" for="checkbox">
            <div class="bar bar--top"></div>
            <div class="bar bar--middle"></div>
            <div class="bar bar--bottom"></div>
          </label>
        </div>
        
      </nav>
    );
};

export default Navbar;
