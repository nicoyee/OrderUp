import '../css/DashboardCustomer.css';
import '../css/Dashboard.css';

import React, { useState, useContext } from 'react';
import { UserContext } from '../App';

import HeaderCustomer from './HeaderCustomer';
import CustomerMenu from './CustomerMenu';
import CustomerFeatureDish from './CustomerFeatureDish';


const DashboardCustomer = () => {
  const user = useContext(UserContext);

  const [customerSection, setCustomerSection] = useState('dashboard');

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className='dashboardContainer'>
      <HeaderCustomer user={user} />

      <div className='dashboardContent'>
        <div className='dashboardContent-main'>
          <div className="dashboardCard">
            <div className="dashboardCardText">
              <span>Dashboard</span>
              <p className="dashboardCardSubtitle">Welcome Back, <span className='dashboardCardName'>{user.name}</span></p>
            </div>
            <div className="dashboardCardIcons">
              <a className="dashboardCardBtn" href="#">
                <span className="material-symbols-outlined">
                  room_service
                </span>
                Create Order
              </a>
              <a className="dashboardCardBtn" href="#">
                <span className="material-symbols-outlined">
                  confirmation_number
                </span>
                Add Voucher
              </a>
            </div>
          </div>
        </div>

        <div className='dashboardContent-side'>
          {/* Add any sidebar content here */}
        </div>

        <div className='customerFeatureDish'>
          <CustomerFeatureDish />
        </div>
        
        <div className="customerMenuContainer">
          <CustomerMenu /> {/* Render CustomerMenu component */}
        </div>
      </div>
    </div>
  );
};

export default DashboardCustomer;