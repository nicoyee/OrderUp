import React, { useState, useEffect } from "react";
import { Link } from 'react-scroll';
import '../css/Navbar.css';

const Navbar = () => {
  
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("section");
      sections.forEach((section) => {
        if (section.getBoundingClientRect().top < window.innerHeight * 0.70) {

          setActiveSection(section.id);
         
        }
      });
    };

    window.addEventListener("scroll", handleScroll);

    return () => {

      window.removeEventListener("scroll", handleScroll);

    };

  }, []);

  return (
      <nav className="navbar1">
        <ul>

          <li className={activeSection === "home" ? "active" : ""}>

            <a href = "#home">home</a>
            
          </li>

          <li className={activeSection === "menu" ? "active" : ""}>

            <a href = "#menu">menu</a>
            
          </li>

          <li className={activeSection === "events" ? "active" : ""}>

            <a href = "#events">events</a>
            
          </li>

          <li className={activeSection === "about" ? "active" : ""}>

            <a href = "#about">about</a>
            
          </li>

        </ul>
      </nav>
    );
};

export default Navbar;
