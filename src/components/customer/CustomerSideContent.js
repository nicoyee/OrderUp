import '../../css/components/customer/CustomerSideContent.css';

import React from "react";

const CustomerSideContent = () => {
  return (
    <div id='customerSideContent'>
        <div className='customerSideContent-section'>
            <div className='customerSideContent-header'>
                <h1>Dishes of the Week</h1>
            </div>
            <div className='customerSideContent-container'>
                
            </div>

        </div>

        <div className='customerSideContent-section'>
            <div className='customerSideContent-header'>
                <h1>Events</h1>
            </div>

            <div className='customerSideContent-container'>
                
            </div>
        </div>
    </div>
  );
};

export default CustomerSideContent;