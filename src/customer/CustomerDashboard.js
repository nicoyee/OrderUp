
import '../common/css/Dashboard.css';
import './css/CustomerDashboard.css';


import { UserContext } from '../App';

import React, { useState, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // For accessing the URL


import Header from "./CustomerHeader";
import Bestsellers from "./CustomerBestsellers";
import Banner from "./CustomerBanner";
import Cart from "./CustomerCart";
import Orders from "./CustomerOrders";
import Menu from "./CustomerMenu";


const CustomerDashboard = () => {
  
  const user = useContext(UserContext);

  return (
    <div className='dashboardContainer'>
      
      <Header />

      <div id='customerDashboard'>

        <Banner />

        <Bestsellers />

        <Menu />

      </div>



    </div>
  );
};

export default CustomerDashboard;
