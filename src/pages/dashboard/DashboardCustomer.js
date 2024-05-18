import '../../css/pages/dashboard/Dashboard.css';

import React from "react";

import Header from "./DashboardHeader";
import Footer from "./DashboardFooter";
import ViewOrders from "../../components/customer/CustomerViewOrders";
import CustomerSideContent from "../../components/customer/CustomerSideContent";

import { MdPostAdd } from "react-icons/md";
import { TbTicket } from "react-icons/tb";

const DashboardCustomer = () => {
  return (
    <div className='dashboardContainer'>

      <Header />

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
            <CustomerSideContent />
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

export default DashboardCustomer;