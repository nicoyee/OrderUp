import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { Bar, Line } from 'react-chartjs-2'; // Import Line chart
import { Chart, registerables } from 'chart.js';
import AdminSalesController from '../class/controllers/AdminSalesController';
import CartController from '../class/controllers/CartController';
import '../css/Admin/AdminSales.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

// Register all Chart.js components
Chart.register(...registerables);

const AdminSales = ({ show, handleClose, userEmail }) => {
    const [bestSellers, setBestSellers] = useState([]);
    const [salesData, setSalesData] = useState([]);
    const [bestSellersChartData, setBestSellersChartData] = useState({});
    const [salesChartData, setSalesChartData] = useState({});
    const [financeChartData, setFinanceChartData] = useState({});
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

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

    // Fetch best sellers data
    const fetchBestSellers = async () => {
        try {
            const bestSellersData = await CartController.getBestSellers();
            setBestSellers(bestSellersData);

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

    // Fetch sales data with year/month filtering
    const fetchSalesData = async () => {
        try {
            const salesData = await AdminSalesController.getSalesByYearAndMonth(userEmail, selectedYear, selectedMonth);
            salesData.sort((a, b) => b.count - a.count);
            setSalesData(salesData);

            if (salesData.length === 0) {
                setSalesChartData(emptyChartData);
            } else {
                const dishNames = salesData.map(dish => dish.dishName);
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
            setSalesChartData(emptyChartData);
        }
    };

    // Fetch finance sales data with year/month filtering
    const fetchFinanceSales = async () => {
        try {
            const data = await AdminSalesController.getfinancesales();

            // Filter data by selected month and year
            const filteredData = data.filter(({ date }) => {
                const saleDate = new Date(date);
                return (
                    saleDate.getMonth() + 1 === selectedMonth &&
                    saleDate.getFullYear() === selectedYear
                );
            });

            const groupedData = filteredData.reduce((acc, { date, amount }) => {
                const dateString = new Date(date).toISOString().split('T')[0]; // YYYY-MM-DD
                acc[dateString] = (acc[dateString] || 0) + amount;
                return acc;
            }, {});

            const labels = Object.keys(groupedData).sort(); // Sort labels
            const amounts = labels.map(label => groupedData[label]); // Get amounts in sorted order

            setFinanceChartData({
                labels,
                datasets: [
                    {
                        label: 'Finance Sales (PHP)',
                        data: amounts,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.1, // Makes the line smooth
                    },
                ],
            });
        } catch (error) {
            console.error('Error fetching finance sales:', error);
        }
    };

    // Fetch data on modal show or when month/year changes
    useEffect(() => {
        if (show) {
            fetchBestSellers();
            fetchSalesData();
            fetchFinanceSales();
        }
    }, [show, userEmail, selectedMonth, selectedYear]);

    const handleMonthChange = (e) => {
        setSelectedMonth(Number(e.target.value));
    };

    const handleYearChange = (e) => {
        setSelectedYear(Number(e.target.value));
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg" centered dialogClassName="admin-sales-modal">
            <Modal.Header closeButton>
                <Modal.Title>Sales Overview</Modal.Title>
                <Button variant="close" className="btn-close" onClick={handleClose}>
                    <i className="bi bi-x-lg"></i>
                </Button>
            </Modal.Header>
            <Modal.Body>
                <Form className="mb-4">
                    <Form.Group className="mr-2">
                        <Form.Label className="mr-2">Month:</Form.Label>
                        <Form.Control as="select" value={selectedMonth} onChange={handleMonthChange}>
                            {[...Array(12).keys()].map((month) => (
                                <option key={month} value={month + 1}>
                                    {new Date(0, month).toLocaleString('default', { month: 'long' })}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label className="mr-2">Year:</Form.Label>
                        <Form.Control
                            type="number"
                            value={selectedYear}
                            onChange={handleYearChange}
                            min="2000"
                            max={new Date().getFullYear()}
                        />
                    </Form.Group>
                </Form>

                <h5>Best Sellers</h5>
                {bestSellers.length > 0 ? (
                    <div className="chart-container">
                        <Bar data={bestSellersChartData} options={{ responsive: true }} />
                    </div>
                ) : (
                    <p>No best sellers available yet.</p>
                )}

                <h5 className="mt-4">Sales Overview</h5>
                <div className="chart-container">
                    {salesData.length > 0 ? (
                        <Bar data={salesChartData} options={{ responsive: true }} />
                    ) : (
                        <Bar data={emptyChartData} options={{ responsive: true }} />
                    )}
                </div>

                <h5 className="mt-4">Finance Sales Overview</h5>
                {Object.keys(financeChartData).length > 0 ? (
                    <div className="chart-container">
                        <Line data={financeChartData} options={{ responsive: true }} /> {/* Change to Line chart */}
                    </div>
                ) : (
                    <p>No finance sales data available.</p>
                )}
            </Modal.Body>
            <Modal.Footer />
        </Modal>
    );
};

export default AdminSales;
