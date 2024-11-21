import "./css/AdminAnalytics.css";

import React, { useEffect, useState, useContext } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

import { UserContext } from "../App";

import Bestsellers from './AdminAnalyticsBestsellers.js';
import Sales from './AdminAnalyticsSales.js';
import Revenue from './AdminAnalyticsRevenue.js';

import AdminSalesController from '../class/controllers/AdminSalesController';

Chart.register(...registerables);

const AdminAnalytics = () => {

    const user = useContext(UserContext);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    

    const handleMonthChange = (e) => {
        setSelectedMonth(parseInt(e.target.value));
    };

    const handleYearChange = (e) => {
        setSelectedYear(parseInt(e.target.value));
    };

    return (
        <div id="adminAnalytics" className="dashboard-content">

            <div className="dashboard-section">

                <div className="userInfo admin">
                    <div className="userInfo-left">
                        <span className="vertical">
                            <h1>Dashboard</h1>
                            <h3>Overview</h3>
                        </span>   
                    </div>
                    <div className="userInfo-right">
                        <span className="horizontal">
                            <select value={selectedMonth} onChange={handleMonthChange}>
                                {[...Array(12).keys()].map((month) => (
                                    <option key={month} value={month + 1}>
                                        {new Date(0, month).toLocaleString('default', { month: 'long' })}
                                    </option>
                                ))}
                            </select>
                            <input
                               type="number"
                               value={selectedYear}
                               onChange={handleYearChange}
                               min="2000"
                               max={new Date().getFullYear()}
                            />
                        </span>
                    </div>
                    
                </div>
                
            </div>

            <div className="dashboard-section">

                <div className="dashboard-section-column">
                    <Bestsellers />
                </div>
                <div className="dashboard-section-column two">
                    <Sales
                        month={selectedMonth}
                        year={selectedYear}
                    />
                    <Revenue
                        month={selectedMonth}
                        year={selectedYear}
                    />
                </div>

            </div>

        </div>
    );

};

export default AdminAnalytics;