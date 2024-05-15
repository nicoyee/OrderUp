import '../../css/pages/dashboard/DashboardCustomer.css';

import React from "react";

import Header from "./DashboardHeader";
import MenuButton from '../../components/MenuButton';
import EventsButton from '../../components/EventsButton';

import ViewOrders from '../../components/customer/CustomerViewOrders';

const DashboardCustomer = () => {
  return (
    <div className='dashboardContainer'>

      <Header />

      <div className='dashboardCustomer'>
        <div className='dashboardCustomer-left'>

          <MenuButton />

        </div>
        <div className='dashboardCustomer-center'>
          
          <ViewOrders />

        </div>
        <div className='dashboardCustomer-right'>

          <EventsButton />

        </div>
      </div>

    </div>
  );
};

export default DashboardCustomer;