import "./css/AdminOrders.css";

import React, { useEffect, useState, useContext } from 'react';

import Admin from "../../class/admin/Admin";

import OrderDetailsModal from "./OrderDetailsModal";

const AdminOrders = () => {

    const [users, setUsers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
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

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const openOrderDetailsModal = (order) => {
        setSelectedOrder(order);
        setShowModal(true);
    };

    const closeOrderDetailsModal = () => {
        setSelectedOrder(null);
        setShowModal(false);
    };
    

    const handleStatusChange = async (order, newStatus) => {
        try {
          if(!order.userEmail) {
            throw new Error("User email is missing from order");
          }
          await Admin.updateCustomerOrderStatus(order.userEmail, order.referenceNumber, newStatus); // Using OrderController function
          console.log("Order status updated successfully.");
          setOrders((prevOrders) =>
            prevOrders.map((o) =>
              o.referenceNumber === order.referenceNumber ? { ...o, status: newStatus }: o
            )
          );
        } catch (error) {
          console.error("Error updating order status:", error);
        }
    };

    return (
        <div id="adminOrders">
            
            <div className="sectionContainer">
                <div className="dataCard">
                    <div className="dataCard-header">
                        <div className="dataCard-header-left">
                            <h1>Order Details</h1>
                        </div>
                    </div>

                    <div className="dataCard-section">
                        <table>

                            <thead>
                                <tr>
                                    <th>Order ID</th>
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
                                        <td>
                                            <select
                                            value={order.status}
                                            onChange={(e) =>
                                                handleStatusChange(
                                                order,
                                                e.target.value)}
                                            >
                                            <option value="pending">Pending</option>
                                            <option value="downpayment-paid">Downpayment Paid</option>
                                            <option value="order-processed">Order Processed</option>
                                            <option value="full-payment-paid">Full Payment Paid</option>
                                            <option value="delivered">Delivered</option>
                                            <option value="cancellation-requested">Cancellation Requested</option>
                                            <option value="cancelled">Cancelled</option>
                                            <option value="refund-requested">Refund Requested</option>
                                            <option value="refunded">Refunded</option>
                                            </select>
                                        </td>
                                        <td>
                                            <button className="view-details-button" onClick={() => openOrderDetailsModal(order)}>View Details</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            
                        </table>
                    </div>
                </div>
            </div>

            {showModal && selectedOrder && (
                <OrderDetailsModal
                    order={selectedOrder}
                    closeModal={closeOrderDetailsModal}
                />
            )}

        </div>
    );

};

export default AdminOrders;