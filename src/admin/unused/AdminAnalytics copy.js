import "./css/AdminAnalytics.css";

import React, { useEffect, useState, useContext } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

import { UserContext } from "../App";

import AdminSalesController from '../class/controllers/AdminSalesController';
import CartController from '../class/controllers/CartController';

Chart.register(...registerables);

const AdminAnalytics = () => {

    const user = useContext(UserContext);
    const [salesData, setSalesData] = useState([]);
    const [bestSellersData, setBestSellersData] = useState([]);
    const [salesChartData, setSalesChartData] = useState({});
    const [financeChartData, setFinanceChartData] = useState({});
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const chartColor = '#0F172A';
    

    const emptyChartData = {
        labels: ['No Data'],
        datasets: [
            {
                label: 'Number of Sales',
                data: [0],
                backgroundColor: ['rgba(0, 0, 0, 0.1)'],
                borderColor: ['rgba(0, 0, 0, 0.1)'],
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        layout: {

        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    
                    padding: 10,
                },
            },
            x: {
                ticks: {

                    padding: 10,
                },
                grid: {
                    display: false,
                },
            }
        },
        plugins: {
            legend: {
                display: false,
            },
        }
    };

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

    const fetchSalesData = async () => {
        try {
            const data = await AdminSalesController.getSalesByYearAndMonth(user.email, selectedYear, selectedMonth);
            const salesArray = Array.isArray(data) ? data : [];
            setSalesData(salesArray);

            if (salesArray.length === 0) {
                setSalesChartData(emptyChartData);
            } else {
                const dishNames = salesArray.map(dish => dish.dishName || 'Unknown');
                const dishCounts = salesArray.map(dish => dish.count || 0);

                setSalesChartData({
                    labels: dishNames,
                    datasets: [
                        {
                            label: 'Number of Sales',
                            data: dishCounts,
                            backgroundColor: chartColor,
                            borderColor: chartColor,
                            borderWidth: 1,
                        },
                    ],
                });
            }
        } catch (error) {
            console.error('Error fetching sales data:', error);
            setSalesChartData(emptyChartData);
        }
    };

    const fetchFinanceSales = async () => {
        try {
            const data = await AdminSalesController.getfinancesales();
            
            if (!Array.isArray(data)) {
                throw new Error('Finance data is not in the expected format');
            }

            // Filter data by selected month and year
            const filteredData = data.filter(item => {
                if (!item || !item.date) return false;
                const saleDate = new Date(item.date);
                return (
                    saleDate.getMonth() + 1 === selectedMonth &&
                    saleDate.getFullYear() === selectedYear
                );
            });

            const groupedData = filteredData.reduce((acc, { date, amount }) => {
                const dateString = new Date(date).toISOString().split('T')[0];
                acc[dateString] = (acc[dateString] || 0) + (amount || 0);
                return acc;
            }, {});

            const labels = Object.keys(groupedData).sort();
            const amounts = labels.map(label => groupedData[label]);

            setFinanceChartData({
                labels,
                datasets: [
                    {
                        label: 'Finance Sales (PHP)',
                        data: amounts,
                        fill: false,
                        backgroundColor: chartColor,
                        borderColor: chartColor,
                        borderWidth: 2,
                        tension: 0,
                    },
                ],
            });
        } catch (error) {
            console.error('Error fetching finance sales:', error);
            setFinanceChartData(emptyChartData);
        }
    };

    // Fetch data when month/year changes
    useEffect(() => {
        fetchSalesData();
        fetchFinanceSales();
    }, [selectedMonth, selectedYear]);

    const handleMonthChange = (e) => {
        setSelectedMonth(parseInt(e.target.value));
    };

    const handleYearChange = (e) => {
        setSelectedYear(parseInt(e.target.value));
    };

    return (
        <div id="adminAnalytics">

            <div className="sectionContainer">

                <div className="userInfo admin">
                    <div className="userInfo-top">
                        <div className="userInfo-left">
                            <h1>Dashboard</h1>
                            <h3>Overview</h3>
                        </div>
                        <div className="userInfo-right">
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
                        </div>
                    </div>
                </div> 

            </div>

            <div className="sectionContainer">
                
                <div className="sectionContainer-column">

                    <div className="dataCard">
                        <div className="dataCard-header">
                            <div className="dataCard-header-left">
                                <h1>Bestsellers</h1>
                            </div>
                        </div>

                        <div className="dataCard-content-full">
                            <div className="adminAnalytics-bestsellerContainer">

                                { bestSellersData.map((dish) => ( 
                                    <div key={dish.id} className="bestsellerItem">

                                        <div className="bestsellerItem-left">
                                            <div className="bestsellerItem-picture">
                                                <img src={dish.photoURL} />
                                            </div>
                                            <div className="bestsellerItem-info">
                                                <h1>{dish.name}</h1>
                                                <h2>PHP {dish.price}</h2>
                                            </div>
                                        </div>

                                        <div className="bestsellerItem-right">
                                            <h1>{dish.count}</h1>
                                        </div>

                                    </div>
                                ))}   

                            </div>                      
                        </div>
                    </div>

                </div>

                <div className="sectionContainer-column modifier00">

                    <div className="dataCard analytics">
                        <div className="dataCard-header">
                            <div className="dataCard-header-left">
                                <h1>Sales by Dish</h1>
                            </div>
                        </div>

                        <div className="dataCard-content-in">
                            {salesData.length > 0 ? (
                                <Bar 
                                    data={salesChartData} 
                                    options={chartOptions} 
                                />
                            ) : (
                                <Bar 
                                    data={emptyChartData} 
                                    options={chartOptions} 
                                />
                            )}
                        </div>
                    </div>

                    <div className="dataCard analytics">
                        <div className="dataCard-header">
                            <div className="dataCard-header-left">
                                <h1>Total Sales</h1>
                            </div>
                        </div>

                        <div className="dataCard-content-in">
                            {Object.keys(financeChartData).length > 0 ? (
                                <Line 
                                    data={financeChartData} 
                                    options={chartOptions}
                                />
                            ) : (
                                <Line 
                                    data={emptyChartData} 
                                    options={chartOptions}
                                />
                            )}
                        </div>
                    </div>             
                </div>
            </div>
        </div>
    );
};

export default AdminAnalytics;