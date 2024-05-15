import '../../css/pages/dashboard/Dashboard.css';

import React from "react";

import Header from "./DashboardHeader";
import Footer from "./DashboardFooter";
import ViewOrders from "../../components/customer/CustomerViewOrders";


const DashboardCustomer = () => {
  return (
    <div className='dashboardContainer'>

      <Header />

      <div className='dashboardContent'>

        <div className='dasboardContent-main'>

          <div id="dashboardCard">
            <div>
              <h1>Welcome Back, JohnLord</h1>
              <p>TUE 17 May 2024</p>
            </div>
          </div>

          <ViewOrders />

        </div>

        <div className='customerDashboard-side'>

        </div>

      </div>

      <Footer />

    </div>
  );
};

export default DashboardCustomer;