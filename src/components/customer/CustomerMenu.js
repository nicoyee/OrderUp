import './css/CustomerDashboardMenu.css';
import food from "../../assets/foodplaceholder.png";

import React from "react";
import {
    AspectRatio
} from '@chakra-ui/react';

const CustomerDashboardMenu = () => {
  return (
    <div id='customerDashboardContainer'>
        <div className='customerDashboard-header'>
            <h1>Dishes of the Week</h1>
        </div>
        <div className='customerDashboard-slider'>

            <div className='customerDashboard-Card customerCardMenu'>
                <img src={ food } />
                <div className="customerDashboard-cardContent">
                    <h2 className="customerDashboard-cardTitle"><span>₱</span>129</h2>
                    <p className="customerDashboard-cardText">Pork Sisig Ala Carte To Go Lorem Ipsum</p>
                    <h3 className="customerDashboard-cardHover">Add to Cart</h3>
                </div>
            </div>

            <div className='customerDashboard-Card customerCardMenu'>
                <img src={ food } />
                <div className="customerDashboard-cardContent">
                    <h2 className="customerDashboard-cardTitle"><span>₱</span>129</h2>
                    <p className="customerDashboard-cardText">Pork Sisig Ala Carte To Go Lorem Ipsum</p>
                    <h3 className="customerDashboard-cardHover">Add to Cart</h3>
                </div>
            </div>

            <div className='customerDashboard-Card customerCardMenu'>
                <img src={ food } />
                <div className="customerDashboard-cardContent">
                    <h2 className="customerDashboard-cardTitle"><span>₱</span>129</h2>
                    <p className="customerDashboard-cardText">Pork Sisig Ala Carte To Go Lorem Ipsum</p>
                    <h3 className="customerDashboard-cardHover">Add to Cart</h3>
                </div>
            </div>

            <div className='customerDashboard-Card customerCardMenu'>
                <img src={ food } />
                <div className="customerDashboard-cardContent">
                    <h2 className="customerDashboard-cardTitle"><span>₱</span>129</h2>
                    <p className="customerDashboard-cardText">Pork Sisig Ala Carte To Go Lorem Ipsum</p>
                    <h3 className="customerDashboard-cardHover">Add to Cart</h3>
                </div>
            </div>

        </div>

    </div>
  );
};

export default CustomerDashboardMenu;