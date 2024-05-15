import '../../css/components/customer/CustomerViewOrders.css';
import '../../css/components/customer/CustomerViewOrders2.css';
import '../../css/orderInfo.css';

import React from "react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';

const CustomerViewOrders = () => {
  return (
    <div className='customerViewOrders'>

        <div className='customerViewOrders-header'>
            <div className='customerViewOrder-header-left'>
              <h1>Orders</h1>
            </div>
        </div>

        <Tabs variant='enclosed' id='customerViewOrdersTab'>
          
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
                  <span className='orderStatus-Ongoing'></span>
                  
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