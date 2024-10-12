import './css/CustomerBanner.css';

import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../App';
import { useLocation } from 'react-router-dom'; // For accessing the URL


const CustomerBanner = () => {
  

  return (
    <div id='customerBanner'>

      <div className='customerBanner-left'>

        <h1>Welcome Back, <span>Yee!</span></h1>

      </div>

      <div className='customerBanner-right'>
        <a>Profile</a>
        <a>Logout</a>
      </div>
      
    </div>
  );
};

export default CustomerBanner;
