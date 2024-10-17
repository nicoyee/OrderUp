
import './css/CustomerOrders.css';

import React, { useState, useContext, useEffect } from 'react';

const CustomerOrders = () => {

  return (
    <div id='customerOrders'>
      
        <h1 className='sectionHeader'>Orders</h1>

        <div className='customerOrders-preview'>

            <div className='customerOrders-previewCard'>
                <h2>11 10 2023</h2>
            </div>

        </div>

    </div>
  );
};

export default CustomerOrders;