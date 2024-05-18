import '../../css/components/customer/CustomerViewOrders.css';
import '../../css/components/customer/CustomerViewOrders.css';
import '../../css/orderInfo.css';

import React from "react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';

import { HiLocationMarker } from "react-icons/hi";

const CustomerViewOrders = () => {
  return (
    <div id='customerViewOrders'>

      <div className='customerViewOrders-header'>
          <div className='customerViewOrders-header-left'>
            <h1>Orders</h1>
          </div>
      </div>

      <Tabs variant='soft-rounded' id='customerViewOrdersTab'>
          
          <TabList>
            <Tab>All</Tab>
            <Tab>Ongoing</Tab>
            <Tab>Pending</Tab>
            <Tab>Completed</Tab>
            <Tab>Cancelled</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>

              <div className='customerOrdersTopPanel'>

                <div className='customerOrdersTopPanel-left'>
                  <span className='orderStatusTag-Ongoing'>Ongoing</span>
                  <span className='orderStatusTag-Pending'>Pending</span>
                  <span className='orderStatusTag-Completed'>Completed</span>
                  <span className='orderStatusTag-Cancelled'>Cancelled</span>
                </div>

                <div className='customerOrdersTopPanel-right'>
                  
                </div>

              </div>

              <div className='customerOrderListItem'>
                  <span className='orderStatus-Pending'></span>
                  <div className='customerOrderListItemInfo'>
                    <span>
                      <h2>05/16/2024</h2>
                      <h3>02:30 PM</h3>
                    </span>
                    <span id='customerOrderListItemInfoLoc'>
                      <HiLocationMarker />
                      <h4>Gov. M. Cuenco Ave., Talamban, Talamban, Cebu City 6000</h4>
                    </span>
                    <span id='customerOrderListItemInfoLoc'>
                      <h5>700.99</h5>
                    </span>
                  </div>
              </div>

            </TabPanel>
            <TabPanel>

              

            </TabPanel>
          </TabPanels>

        </Tabs>

    </div>
  );
};

export default CustomerViewOrders;