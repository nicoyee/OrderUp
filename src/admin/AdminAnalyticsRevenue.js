import React, { useEffect, useState, useContext } from 'react';
import { Line } from 'react-chartjs-2';

import AdminSalesController from '../class/controllers/AdminSalesController';

const AdminAnalyticsRevenue = ({ month, year }) => {
    
    const [showLabels, setShowLabels] = useState(false);
    const [financeChartData, setFinanceChartData] = useState({});
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
        const fetchFinanceSales = async () => {
          try {
            const data = await AdminSalesController.getfinancesales();
            
            if (!Array.isArray(data)) {
              throw new Error('Finance data is not in the expected format');
            }
    
            const filteredData = data.filter(item => {
              if (!item || !item.date) return false;
              const saleDate = new Date(item.date);
              return (
                saleDate.getMonth() + 1 === month &&
                saleDate.getFullYear() === year
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
              datasets: [{
                label: 'Finance Sales (PHP)',
                data: amounts,
                fill: false,
                backgroundColor: chartColor,
                borderColor: chartColor,
                borderWidth: 2,
                tension: 0,
              }],
            });
          } catch (error) {
            console.error('Error fetching finance sales:', error);
            setFinanceChartData(emptyChartData);
          }
        };
    
        fetchFinanceSales();
    }, [month, year]);

    return (
        <div id="adminAnalyticsRevenue" className="dataCard admin" onMouseEnter={() => setShowLabels(true)} onMouseLeave={() => setShowLabels(false)}>

            <div className="dataCard-header">
                <h1>Revenue</h1>
            </div>

            <div className="dataCard-content">
                <Line 
                    data={Object.keys(financeChartData).length > 0 ? financeChartData : emptyChartData} 
                    options={chartOptions}
                />
            </div>

            <div className="dataCard-footer">
                
            </div>

        </div>
    );

};

export default AdminAnalyticsRevenue;