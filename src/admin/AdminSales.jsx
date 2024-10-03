import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import AdminSalesController from '../class/controllers/AdminSalesController';
import CartController from '../class/controllers/CartController'; // Ensure to import CartController for best sellers
import '../css/Admin/AdminSales.css';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Import Bootstrap Icons

// Register all Chart.js components
Chart.register(...registerables);

const AdminSales = ({ show, handleClose, userEmail }) => {
    const [bestSellers, setBestSellers] = useState([]);
    const [salesData, setSalesData] = useState([]);
    const [bestSellersChartData, setBestSellersChartData] = useState({});
    const [salesChartData, setSalesChartData] = useState({});

    // Utility function to generate random color
    const generateRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    // Fetch best sellers data
    const fetchBestSellers = async () => {
        try {
            const bestSellersData = await CartController.getBestSellers();
            setBestSellers(bestSellersData);

            // Prepare data for best sellers chart
            const dishNames = bestSellersData.map(dish => dish.name);
            const dishCounts = bestSellersData.map(dish => dish.count);
            const dishColors = bestSellersData.map(() => generateRandomColor());

            setBestSellersChartData({
                labels: dishNames,
                datasets: [
                    {
                        label: 'Number of Sales',
                        data: dishCounts,
                        backgroundColor: dishColors,
                        borderColor: dishColors,
                        borderWidth: 1,
                    },
                ],
            });
        } catch (error) {
            console.error('Error fetching best sellers:', error);
        }
    };

    // Fetch sales data
    const fetchSalesData = async () => {
        try {
            const salesData = await AdminSalesController.getSales(userEmail);
            setSalesData(salesData);

            // Prepare data for sales chart
            const dishNames = salesData.map(dish => dish.name);
            const dishCounts = salesData.map(dish => dish.count);
            const dishColors = salesData.map(() => generateRandomColor());

            setSalesChartData({
                labels: dishNames,
                datasets: [
                    {
                        label: 'Number of Sales',
                        data: dishCounts,
                        backgroundColor: dishColors,
                        borderColor: dishColors,
                        borderWidth: 1,
                    },
                ],
            });
        } catch (error) {
            console.error('Error fetching sales data:', error);
        }
    };

    useEffect(() => {
        if (show) {
            fetchBestSellers();
            fetchSalesData();
        }
    }, [show, userEmail]);

    return (
        <Modal
            show={show}
            onHide={handleClose}
            size="lg"
            centered
            dialogClassName="admin-sales-modal" // Use the custom class for centering
        >
            <Modal.Header closeButton>
                <Modal.Title>Sales Overview</Modal.Title>
                <Button
                    variant="close"
                    className="btn-close"
                    aria-label="Close"
                    onClick={handleClose}
                >
                    <i className="bi bi-x-lg"></i> {/* Bootstrap Icon for close */}
                </Button>
            </Modal.Header>
            <Modal.Body>
                <h5>Best Sellers</h5>
                {bestSellers.length > 0 ? (
                    <div className="chart-container">
                        <Bar
                            data={bestSellersChartData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    title: {
                                        display: true,
                                        text: 'Best Sellers',
                                    },
                                },
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        title: {
                                            display: true,
                                            text: 'Sales Count',
                                        },
                                    },
                                    x: {
                                        title: {
                                            display: true,
                                            text: 'Dishes',
                                        },
                                    },
                                },
                            }}
                        />
                    </div>
                ) : (
                    <p>No best sellers available yet.</p>
                )}

                <h5 className="mt-4">Sales Overview</h5>
                {salesData.length > 0 ? (
                    <div className="chart-container">
                        <Bar
                            data={salesChartData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    title: {
                                        display: true,
                                        text: 'Sales Overview',
                                    },
                                },
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        title: {
                                            display: true,
                                            text: 'Sales Count',
                                        },
                                    },
                                    x: {
                                        title: {
                                            display: true,
                                            text: 'Dishes',
                                        },
                                    },
                                },
                            }}
                        />
                    </div>
                ) : (
                    <p>No sales data available yet.</p>
                )}
            </Modal.Body>
            <Modal.Footer>
              
            </Modal.Footer>
        </Modal>
    );
};

export default AdminSales;
