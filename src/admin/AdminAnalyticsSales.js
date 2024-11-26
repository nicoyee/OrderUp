import React, { useEffect, useState, useContext } from 'react';
import { Bar } from 'react-chartjs-2';

import { UserContext } from "../App";

import AdminSalesController from '../class/controllers/AdminSalesController';

const AdminAnalyticsSales = ({ month, year }) => {

    const user = useContext(UserContext);
    const [showLabels, setShowLabels] = useState(false);
    const [salesData, setSalesData] = useState([]);
    const [salesChartData, setSalesChartData] = useState({});
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
        animation: {
            duration: 300
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    padding: 10,
                },
                grid: {
                    display: false,
                },
                border: {
                    display: false
                }
            },
            x: {
                ticks: {       
                    display: showLabels,
                    padding: 10,
                },
                grid: {
                    display: false,
                },
                border: {
                    display: false
                }
            }
        },
        plugins: {
            legend: {
                display: false,
            },
        }
    };

    useEffect(() => {
        const fetchSalesData = async () => {
          try {
            const data = await AdminSalesController.getSalesByYearAndMonth(user.email, year, month);
            const salesArray = Array.isArray(data) ? data : [];
            setSalesData(salesArray);
    
            if (salesArray.length === 0) {
              setSalesChartData(emptyChartData);
            } else {
              const dishNames = salesArray.map(dish => dish.dishName || 'Unknown');
              const dishCounts = salesArray.map(dish => dish.count || 0);
    
              setSalesChartData({
                labels: dishNames,
                datasets: [{
                  label: 'Number of Sales',
                  data: dishCounts,
                  backgroundColor: chartColor,
                  borderColor: chartColor,
                  borderWidth: 1,
                }],
              });
            }
          } catch (error) {
            console.error('Error fetching sales data:', error);
            setSalesChartData(emptyChartData);
          }
        };
    
        fetchSalesData();
      }, [month, year]);

    return (
        <div id="adminAnalyticsSales" className="dataCard admin" onMouseEnter={() => setShowLabels(true)} onMouseLeave={() => setShowLabels(false)} >

            <div className="dataCard-header">
                <h1>Sales</h1>
            </div>

            <div className="dataCard-content">
                <Bar 
                    data={salesData.length > 0 ? salesChartData : emptyChartData} 
                    options={chartOptions} 
                />
            </div>

            <div className="dataCard-footer">
                
            </div>

        </div>
    );

};

export default AdminAnalyticsSales;