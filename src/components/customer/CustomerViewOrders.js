import '../../css/components/customer/CustomerViewOrders.css';
import '../../css/orderInfo.css';

import React from "react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';

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

                <div className='customerOrderListItem-left'>
                  <span className='orderStatus-Pending'></span>
                  24 May 04:30 PM
                </div>
                
                <div className='customerOrderListItem-right'>
                  <h5>Cancel</h5>
                </div>

              </div>

            </TabPanel>
            <TabPanel>

              <p>Hello2</p>

            </TabPanel>
          </TabPanels>

        </Tabs>

    </div>
  );
};

export default CustomerViewOrders;