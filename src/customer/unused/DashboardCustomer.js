
import './css/DashboardCustomer.css';

import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../../App';
import { useLocation } from 'react-router-dom'; // For accessing the URL

import HeaderCustomer from '../HeaderCustomer';
import CustomerMenu from '../CustomerMenu';
import CustomerFeatureDish from './CustomerFeatureDish';

const DashboardCustomer = () => {
  const user = useContext(UserContext);
  const [customerSection, setCustomerSection] = useState('dashboard');
  const location = useLocation();  // Access the current URL

  // Display messages based on URL query params (success or cancel)
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
      <HeaderCustomer user={user} />

      <div className='dashboardContent'>
        <div className='dashboardContent-main'>
          <div className="dashboardCard">
            <div className="dashboardCardText">
              <span>Dashboard</span>
              <p className="dashboardCardSubtitle">Welcome Back, <span className='dashboardCardName'>{user.name}</span></p>
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
