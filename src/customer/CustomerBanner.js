import './css/CustomerBanner.css';

import React, { useState, useContext, useEffect } from 'react';

const CustomerBanner = ({ user }) => {

  return (
    <div id='customerBanner'>

      <div className='customerBanner-left'>

        <h1>Welcome Back, <span>{user.name}!</span></h1>

      </div>

      <div className='customerBanner-right'>
        <button>Profile</button>
        <button>Logout</button>
      </div>
      
    </div>
  );
};

export default CustomerBanner;
