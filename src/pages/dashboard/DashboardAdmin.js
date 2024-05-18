import '../../css/pages/dashboard/Dashboard.css';

import React from "react";

import Header from "./DashboardHeader";
import Footer from "./DashboardFooter";
import ViewOrders from "../../components/customer/CustomerViewOrders";

import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { MdOutlineLibraryAdd } from "react-icons/md";

const DashboardAdmin = () => {
  return (
    <div className='dashboardContainer'>

      <Header />

      <div className='dashboardContent'>

        <div className='dashboardContent-side'>

          <div className='dashboardContent-adminnav'>

          </div>

          <div id="dashboardCard">
            <div className="dashboardCard-header">
              <h1>Welcome Back, <span>John</span></h1>
              <p>TUE 17 May 2024</p>
            </div>
            <div className="dashboardCard-buttons">
              <div className='dashboardCard-btn'>
                <AiOutlineUsergroupAdd />
                <h1>Create Staff</h1>
              </div>
              <div className='dashboardCard-btn'>
                <MdOutlineLibraryAdd />
                <h1>Add Dish</h1>
              </div>
            </div>
          </div>

          

          <div className='dashboardContent-sub'>

          </div>

        </div>

        <div className='dashboardContent-main'>

        </div>

      </div>

      <Footer />

    </div>
  );
};

export default DashboardAdmin;