import '../../css/pages/dashboard/Dashboard.css';

import React, { useState } from "react";

import Header from "../../pages/dashboard/DashboardHeader";
import Footer from "../../pages/dashboard/DashboardFooter";
import ViewOrders from "../customer/CustomerOrders";

import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { MdOutlineLibraryAdd } from "react-icons/md";

const AdminDashboard = () => {

  const [ userType, setUserType ] = useState('admin');
  const [ dashboardSection, setDashboardSection ] = useState('orders');
  
  return (
    <div className='dashboardContainer'>

      <Header userType={ userType } dashboardSection={ dashboardSection } setDashboardSection={ setDashboardSection } />

      <div className='dashboardContent'>

        <div className='dashboardContent-side'>

          <div id="dashboardCard">
            <div className="dashboardCard-header">
              <h1>Welcome Back, <span>John</span></h1>
              <p>TUE 17 May 2024</p>
            </div>
            <div className="dashboardCard-buttons">
              <div className='dashboardCard-btn'>
                <AiOutlineUsergroupAdd />
                <h2>Create Staff</h2>
              </div>
              <div className='dashboardCard-btn'>
                <MdOutlineLibraryAdd />
                <h2>Add Dish</h2>
              </div>
              <div className='dashboardCard-btn'>
                <MdOutlineLibraryAdd />
                <h2>Create Event</h2>
              </div>
            </div>
          </div>

          <div className='dashboardContent-sub'>
          
          </div>

        </div>

        <div className='dashboardContent-main'>
           { dashboardSection === 'orders' && (<ViewOrders />)}
        </div>

      </div>

      <Footer />

    </div>
  );
};

export default AdminDashboard;