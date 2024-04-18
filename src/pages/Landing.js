import '../css/Landing.css';

import React, { useState, useEffect } from "react";

import Navbar from '../components/Navbar';
import DashNeutral from '../sections/Dashboard';
import Menu from '../sections/Menu';

const LandingPage = () => {
  
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
    
    <div className = "landing">

      <Navbar activeSection={activeSection} />

      <div className = "content">

        <DashNeutral />

        <Menu />

      </div>  

    </div>

  );
};

export default LandingPage;