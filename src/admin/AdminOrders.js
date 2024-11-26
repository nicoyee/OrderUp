import "./css/AdminOrders.css";

import { CgEye } from "react-icons/cg";

import React, { useEffect, useState, useContext } from 'react';
import Modal from 'react-modal';

import Admin from '../class/admin/Admin';

import Loading from '../common/Loading';
import OrderDetails from './AdminOrdersOrderDetails';

const AdminOrders = () => {

    const [ users, setUsers ] = useState([]);
    const [ orders, setOrders ] = useState([]);
    const [ currentPage, setCurrentPage ] = useState(1);
    const [ loading, setLoading ] = useState(true);
    const [ modal, showModal] = useState(false);
    const [ selectedOrder, setSelectedOrder ] = useState(null);
    const ordersPerPage = 8;

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
            } finally {
                setLoading(false);
            }
        };
        fetchUsersAndOrders();
    }, []);

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

    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const viewOrderDetailsModal = (order) => {
        setSelectedOrder(order);
        showModal(true);
        document.body.classList.add('modal-open');
    };

    const closeOrderDetailsModal = () => {
        setSelectedOrder(null);
        showModal(false);
        document.body.classList.remove('modal-open');
    };

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
                            <h1>Order Details</h1>
                        </div>
                    </div>

                    <div className="dataCard-content full">
                    {loading ? (

                        <Loading />     

                    ) : (

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
                                        <button 
                                            className="secondaryButton tooltip"
                                            onClick={() => viewOrderDetailsModal(order)}
                                        >
                                            <CgEye />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>

                    )}
                    </div>

                    <div className="dataCard-footer">
                        <div className="dataCard-footer-right">
                        {Array.from({ length: Math.ceil(orders.length / ordersPerPage) }, (_, i) => (
                            <button
                                key = {i + 1}
                                onClick = {() => paginate(i + 1)}
                                className = {`paginationButton ${
                                    currentPage === i + 1
                                        ? 'active'
                                        : ''
                                }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                        </div>
                    </div>

                </div>

            </div>

            <Modal
               isOpen={ modal }
               onRequestClose={ closeOrderDetailsModal }
               className={`${ modal ? 'modal-open' : '' }`}
               overlayClassName="modalOverlay" 
            >
                { selectedOrder && (
                    <OrderDetails 
                        closeOrderDetailsModal = { closeOrderDetailsModal }
                        order = { selectedOrder }
                    />
                )}
            </Modal>

        </div>
    );

};

export default AdminOrders;