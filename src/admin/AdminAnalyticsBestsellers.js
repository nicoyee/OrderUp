import "./css/AdminAnalyticsBestsellers.css";

import { FaFire } from "react-icons/fa";
import { RiBarChartFill } from "react-icons/ri";


import React, { useEffect, useState, useContext } from 'react';

import CartController from '../class/controllers/CartController';

const AdminAnalyticsBestsellers = () => {

    const [bestSellersData, setBestSellersData] = useState([]);

    useEffect(() => {
        const fetchBestSellers = async () => {
            try {
                const bestSellersData = await CartController.getBestSellers();
                setBestSellersData(bestSellersData);
            } catch (error) {
                console.error('Error fetching best sellers:', error);
            }
        };
        fetchBestSellers();
    }, []);

    return (
        <div id="adminAnalyticsBestsellers" className="dataCard admin">

            <div className="dataCard-header">
                <span className="cardTitleIcon">
                    <FaFire />
                    <h1>Trending Items</h1>
                </span>
            </div>

            <div className="dataCard-content">
                <div className="bestsellers-container">

                { bestSellersData.map((dish, index) => ( 
                    <div key={dish.id} className="bestsellers-item">

                        <div className="bestsellers-item-left">
                            <div className="bestsellers-item-ranking">
                                <h1><span>#</span>{index + 1}</h1>
                            </div>

                            <div className="bestsellers-item-picture">
                                <img src={dish.photoURL} />
                            </div>
                            <div className="bestsellers-item-info">
                                <h1>{dish.name}</h1>
                                <h2>PHP {dish.price}</h2>
                            </div>
                        </div>

                        <div className="bestsellers-item-right">
                            <h1>{dish.count}</h1>
                            <RiBarChartFill />
                        </div>

                    </div>
                ))}   

                </div>
            </div>

            <div className="dataCard-footer">
                
            </div>

        </div>
    );

};

export default AdminAnalyticsBestsellers;