import "./css/AdminOrders.css";

import { FaBoxes } from "react-icons/fa";
import { CgEye } from "react-icons/cg";

import React, { useEffect, useState, useContext } from 'react';
import Modal from 'react-modal';

import Admin from '../class/admin/Admin';

const AdminOrders = () => {

    const [ users, setUsers ] = useState([]);
    const [ orders, setOrders ] = useState([]);
    const [ currentPage, setCurrentPage ] = useState(1);
    const ordersPerPage = 10;

    useEffect(() => {
        const fetchUsersAndOrders = async () => {
          try {
              const usersData = await Admin.fetchUsers();
              setUsers(usersData);
              
              const allOrders = [];
              for (const user of usersData) {
                const userOrders = await Admin.fetchOrderHistory(user.email);
                allOrders.push(...userOrders);
              }
              allOrders.sort((a, b) => b.createdDate.seconds - a.createdDate.seconds);
              console.log("Orders Fetched:", allOrders);
              setOrders(allOrders);
          } catch (error) {
            console.error("Error fetching order IDs:", error);
          }
        };
        fetchUsersAndOrders();
    }, []);

    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

    return (
        <div id="adminOrders" className="dashboard-content">

            <div className="dashboard-section">
                <div className="userInfo admin">
                    <span className="vertical">
                        <h1>Dashboard</h1>
                        <h3>Orders</h3>
                    </span>
                </div>  
            </div>

            <div className="dashboard-section">

                <div className="dataCard table">
                    <div className="dataCard-header">
                        <div className="dataCard-header-section">
                            <span className="cardTitleIcon">
                                <FaBoxes />
                                <h1>Orders</h1>
                            </span>
                        </div>
                    </div>

                    <div className="dataCard-content full">
                        <table>
                            <thead>
                                <tr>
                                    <th>Ref#</th>
                                    <th>Email</th>
                                    <th>Date</th>
                                    <th>Total Amount</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                            {currentOrders.map((order) => (
                                <tr key={order.referenceNumber}>
                                    <td>{order.referenceNumber}</td>
                                    <td>{order.userEmail}</td>
                                    <td>{new Date(order.createdDate.seconds * 1000).toLocaleString()}</td>
                                    <td>₱{order.totalAmount.toFixed(2)}</td>
                                    <td></td>
                                    <td>
                                        <button 
                                            className="secondaryButton tooltip"

                                        >
                                            <CgEye />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>

                        </table>
                    </div>

                    <div className="dataCard-footer">
                        
                    </div>

                </div>

            </div>

        </div>
    );

};

export default AdminOrders;