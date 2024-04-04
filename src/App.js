import './css/App.css';

import React, { useState, useEffect } from "react";

import Banner from './components/Banner';
import Landing from './pages/Landing';
import Navbar from './components/Navbar';

import dishbig from './assets/home1.png';

function App() {

  return (
    
    <div>

      <Banner />

      <Landing />


    </div>

  );
}

export default App;
