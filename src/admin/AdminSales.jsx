import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
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
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Default to current month
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Default to current year

    // Utility function to generate random color
    const generateRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    const emptyChartData = {
        labels: ['No Data'],  // Placeholder label when there's no data
        datasets: [
            {
                label: 'Number of Sales',
                data: [0],  // Empty data set
                backgroundColor: ['rgba(0, 0, 0, 0.1)'],  // Transparent or light color
                borderColor: ['rgba(0, 0, 0, 0.1)'],
                borderWidth: 1,
            },
        ],
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

    // Fetch sales data using getSales from AdminSalesController
    const fetchSalesData = async () => {
        try {
            // Pass selectedMonth and selectedYear to filter data
            const salesData = await AdminSalesController.getSales(userEmail, selectedMonth, selectedYear);
            
            // Prepare default empty data structure for the chart
            const emptyChartData = {
                labels: ['No Data'],  // Placeholder label when there's no data
                datasets: [
                    {
                        label: 'Number of Sales',
                        data: [0],  // Empty data set
                        backgroundColor: ['rgba(0, 0, 0, 0.1)'],  // Transparent or light color
                        borderColor: ['rgba(0, 0, 0, 0.1)'],
                        borderWidth: 1,
                    },
                ],
            };

            // Check if salesData is empty and set the empty chart data
            if (salesData.length === 0) {
                setSalesData([]);  // No sales data available
                setSalesChartData(emptyChartData);  // Display empty chart
            } else {
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
            }
        } catch (error) {
            console.error('Error fetching sales data:', error);
            setSalesChartData(emptyChartData);  // Display empty chart on error
        }
    };

    // Fetch data when modal is shown or when month/year changes
    useEffect(() => {
        if (show) {
            fetchBestSellers();
            fetchSalesData();  // Fetch sales data whenever the modal is shown or month/year changes
        }
    }, [show, userEmail, selectedMonth, selectedYear]);

    // Handle month change
    const handleMonthChange = (e) => {
        setSelectedMonth(Number(e.target.value));
    };

    // Handle year change
    const handleYearChange = (e) => {
        setSelectedYear(Number(e.target.value));
    };

    return (
        <Modal
            show={show}
            onHide={handleClose}
            size="lg"
            centered
            dialogClassName="admin-sales-modal"
        >
            <Modal.Header closeButton>
                <Modal.Title>Sales Overview</Modal.Title>
                <Button
                    variant="close"
                    className="btn-close"
                    aria-label="Close"
                    onClick={handleClose}
                >
                    <i className="bi bi-x-lg"></i>
                </Button>
            </Modal.Header>
            <Modal.Body>
                <Form className="mb-4"> {/* Removed 'inline' */}
                    <Form.Group controlId="formBasicEmail" className="mr-2">
                        <Form.Label className="mr-2">Month:</Form.Label>
                        <Form.Control as="select" value={selectedMonth} onChange={handleMonthChange}>
                            {[...Array(12).keys()].map((month) => (
                                <option key={month} value={month + 1}>
                                    {new Date(0, month).toLocaleString('default', { month: 'long' })}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="formBasicPassword">
                        <Form.Label className="mr-2">Year:</Form.Label>
                        <Form.Control
                            type="number"
                            value={selectedYear}
                            onChange={handleYearChange}
                            min="2000"
                            max={new Date().getFullYear()} // Limit to current year
                        />
                    </Form.Group>
                </Form>

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
                    <p>No sales data available for the selected month.</p> // Updated message
                )}
            </Modal.Body>
            <Modal.Footer>
                {/* You can add footer actions here */}
            </Modal.Footer>
        </Modal>
    );
};

export default AdminSales;