import './css/CustomerCart.css';

import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../App';
import { useLocation } from 'react-router-dom'; // For accessing the URL


const CustomerCart = () => {
  

  return (
    <div id='customerCart'>

        <div className='customerCart-label card'>
          <h1>My Cart</h1>
        </div>

        <div className='customerCart-productList card'>
          <div className='customerCart-product'>
            <div className='customerCart-productInfo'>
              <h1>Sizzling Sisig</h1>
              <img />
            </div>
            <div className='customerCart-productAction'>
              
            </div>
          </div>
        </div>
      
    </div>
  );
};

export default CustomerCart;
