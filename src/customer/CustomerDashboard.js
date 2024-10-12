
import '../common/css/Dashboard.css';
import './css/CustomerDashboard.css';

import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../App';
import { useLocation } from 'react-router-dom'; // For accessing the URL

import Header from "./CustomerHeader";
import Banner from "./CustomerBanner";
import Cart from "./CustomerCart";
import Orders from "./CustomerOrders";
import Menu from "./CustomerMenu";


const CustomerDashboard = () => {
  

  return (
    <div className='dashboardContainer'>

      <Header />

      <div id='customerDashboard'>

        <div className='customerDashboard-main'>
          <Banner />
          <Menu />
        </div>

        <div className='customerDashboard-side'>
          <Cart />
        </div>

      </div>   

    </div>
  );
};

export default CustomerDashboard;
