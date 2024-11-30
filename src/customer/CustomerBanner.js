import './css/CustomerBanner.css';

import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../App';

import Bestsellers from "./CustomerBestsellers";

import landingpic from '../assets/landing.jpg';

const CustomerBanner = () => {

  const user = useContext(UserContext);

  return (
    <div id='customerBanner'>

      <div className='customerBanner-image'>
        <img src={landingpic} />
      </div>

      <div className='customerBanner-caption'>
        <h1>Elevating the everyday grain</h1>

        <div className='customerBanner-caption-buttons'>

          <a href='#customerEvents'>
            Our Events
          </a>

          <p>·</p>

          <a href='#customerMenu'>
            Our Menu
          </a>

        </div>
      </div>
      
    </div>
  );
};

export default CustomerBanner;
