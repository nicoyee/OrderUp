import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import CartController from '../class/controllers/CartController';
import '../css/Admin/AdminSales.css';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Import Bootstrap Icons

// Register all Chart.js components
Chart.register(...registerables);

const AdminSales = ({ show, handleClose }) => {
    const [bestSellers, setBestSellers] = useState([]);
    const [chartData, setChartData] = useState({});

    // Utility function to generate random color
    const generateRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    useEffect(() => {
        const fetchBestSellers = async () => {
            try {
                const bestSellersData = await CartController.getBestSellers();
                setBestSellers(bestSellersData);

                // Prepare data for chart
                const dishNames = bestSellersData.map(dish => dish.name);
                const dishCounts = bestSellersData.map(dish => dish.count);

                // Generate a unique color for each dish
                const dishColors = bestSellersData.map(() => generateRandomColor());

                setChartData({
                    labels: dishNames,
                    datasets: [
                        {
                            label: 'Number of Sales',
                            data: dishCounts,
                            backgroundColor: dishColors, // Use the generated colors
                            borderColor: dishColors, // Optional: Set the border color same as background
                            borderWidth: 1,
                        },
                    ],
                });
            } catch (error) {
                console.error('Error fetching best sellers:', error);
            }
        };

        if (show) {
            fetchBestSellers();
        }
    }, [show]);

    return (
        <Modal
            show={show}
            onHide={handleClose}
            size="lg"
            centered
            dialogClassName="admin-sales-modal" // Use the custom class for centering
        >
            <Modal.Header closeButton>
                <Modal.Title>Best Sellers</Modal.Title>
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
                {bestSellers.length > 0 ? (
                    <div className="chart-container">
                        <Bar
                            data={chartData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
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
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AdminSales;
