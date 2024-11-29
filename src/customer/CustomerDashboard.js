import '../common/css/Dashboard.css';
import './css/CustomerDashboard.css';


import { UserContext } from '../App';

import React, { useState, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // For accessing the URL


import Header from "./CustomerHeader";
import Events from "./CustomerEvents";
import Bestsellers from "./CustomerBestsellers";
import Banner from "./CustomerBanner";
import Cart from "./CustomerCart";
import Menu from "./CustomerMenu";


const CustomerDashboard = () => {
  
  const user = useContext(UserContext);
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    if (queryParams.get('status') === 'success') {
      alert('Payment successful! Welcome back to your dashboard.');
    } else if (queryParams.get('status') === 'cancel') {
      alert('Payment was canceled. You have been redirected to your dashboard.');
    }
  }, [location.search]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className='dashboardContainer'>
      
      <Header />

      <div id='customerDashboard'>

        <Banner />

        <Events />

        <Bestsellers />

        <Menu />

      </div>

    </div>
  );
};

export default CustomerDashboard;
