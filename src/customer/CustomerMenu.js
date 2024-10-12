import './css/CustomerMenu.css';

import React, { useState, useContext, useEffect } from 'react';
import Customer from '../class/Customer.ts';

import test from '../assets/foodplaceholder.png';

const CustomerMenu = () => {

  const [dishes, setDishes] = useState([]);

  return (
    <div id='customerMenu'>

      <h1 className='sectionHeader'>Our Menu</h1>

      <div className='customerMenu-categories'>
        <button>
          <span>Vegetarian</span>
        </button>

        <button className='active'>
          <span>Vegetarian</span>
        </button>

        <button>
          <span>Vegetarian</span>
        </button>

        <button>
          <span>Vegetarian</span>
        </button>

      </div>

      <div className='customerMenu-content'>

        <div className='customerMenu-item'>
          <div className='customerMenu-itemMain'>
            <img src={test} />
          </div>
          <div className='customerMenu-itemSub'>
            <div className='customerMenu-itemSub-description'>
              <h2>Pork Sisig</h2>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing</p>
            </div>
            <div className='customerMenu-itemSub-price'>
              <h3>1099</h3>
            </div>
          </div>
        </div>

        <div className='customerMenu-item'>
          <div className='customerMenu-itemMain'>
            <img src={test} />
          </div>
          <div className='customerMenu-itemSub'>
            <div className='customerMenu-itemSub-description'>
              <h2>Pork Sisig</h2>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing</p>
            </div>
            <div className='customerMenu-itemSub-price'>
              <h3>1099</h3>
            </div>
          </div>
        </div>
        <div className='customerMenu-item'>
          <div className='customerMenu-itemMain'>
            <img src={test} />
          </div>
          <div className='customerMenu-itemSub'>
            <div className='customerMenu-itemSub-description'>
              <h2>Pork Sisig</h2>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing</p>
            </div>
            <div className='customerMenu-itemSub-price'>
              <h3>1099</h3>
            </div>
          </div>
        </div>
        <div className='customerMenu-item'>
          <div className='customerMenu-itemMain'>
            <img src={test} />
          </div>
          <div className='customerMenu-itemSub'>
            <div className='customerMenu-itemSub-description'>
              <h2>Pork Sisig</h2>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing</p>
            </div>
            <div className='customerMenu-itemSub-price'>
              <h3>1099</h3>
            </div>
          </div>
        </div>

        



      </div>

    </div>
  );
};

export default CustomerMenu;
