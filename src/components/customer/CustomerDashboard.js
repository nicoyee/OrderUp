import '../common/dashboard/css/Dashboard.css';

import React, { useState } from "react";

import Header from "../common/dashboard/DashboardHeader";
import Footer from "../common/dashboard/DashboardFooter";
import ViewOrders from "./CustomerOrders";
import Menu from "./CustomerMenu";

import { MdPostAdd } from "react-icons/md";
import { TbTicket } from "react-icons/tb";

const CustomerDashboard = () => {

  const [ userType, setUserType ] = useState('customer');

  return (
    <div className='dashboardContainer'>

      <Header userType={ userType } />

      <div className='dashboardContent'>

        <div className='dashboardContent-side'>
          <div id="dashboardCard">
            <div className="dashboardCard-header">
              <h1>Welcome Back, <span>John</span></h1>
              <p>TUE 17 May 2024</p>
            </div>
            <div className="dashboardCard-buttons">
              <div className='dashboardCard-btn'>
                <MdPostAdd />
                <h1>Order Again</h1>
              </div>
              <div className='dashboardCard-btn'>
                <TbTicket />
                <h1>Add Voucher</h1>
              </div>
            </div>
          </div>

          <div className='dashboardContent-sub'>
            <Menu />
            <Menu />
          </div>

        </div>

        <div className='dashboardContent-main'>
          <ViewOrders />
        </div>

      </div>

      <Footer />

    </div>
  );
};

export default CustomerDashboard;