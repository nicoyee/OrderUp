import '../common/dashboard/css/Dashboard.css';
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { MdOutlineLibraryAdd } from "react-icons/md";

import Header from "../common/dashboard/DashboardHeader";
import Footer from "../common/dashboard/DashboardFooter";
import ManageOrders from "./AdminOrders.js";
import ManageUsers from "./AdminUsers.js";
import ManageMenu from "./AdminMenu.js";
import ManageEvents from "./AdminEvents.js";

import React, { useState, useContext } from "react";
import { UserContext } from '../../App';

const AdminDashboard = () => {

  const [ dashboardSection, setDashboardSection ] = useState('orders');
  
  const user = useContext(UserContext);

  return (
    <div className='dashboardContainer'>

      <Header user={ user } dashboardSection={ dashboardSection } setDashboardSection={ setDashboardSection } />

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
           { dashboardSection === 'orders' && (<ManageOrders />)}
           { dashboardSection === 'users' && (<ManageUsers />)}
           { dashboardSection === 'menu' && (<ManageMenu />)}
           { dashboardSection === 'events' && (<ManageEvents />)}
        </div>

      </div>

      <Footer />

    </div>
  );
};

export default AdminDashboard;