import React, { useEffect, useState } from "react";
import Admin from "../class/admin/Admin";
import '../css/Admin/OrderHistoryAdmin.css';
import '../css/Admin/OrderDetailsModal.css';
const OrderHistoryAdmin = () => {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

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
        
        setOrders(allOrders);
      } catch (error) {
        console.error("Error fetching order IDs:", error);
      }
    };

    fetchUsersAndOrders();
  }, []);

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
    <div className="menuTable">
      <h1>All Orders</h1>
      <table className="dataTableHistory">
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
          {orders.map((order) => (
            <tr key={order.referenceNumber}>
              <td>{order.referenceNumber}</td>
              <td>{order.userEmail}</td>
              <td>{new Date(order.createdDate.seconds * 1000).toLocaleString()}</td>
              <td>₱{order.totalAmount}</td>
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
                </select>
              </td>
              <td>
                <button onClick={() => openOrderDetailsModal(order)}>View Details</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          closeModal={closeOrderDetailsModal}
        />
      )}
    </div>
  );
};

const OrderDetailsModal = ({ order, closeModal}) => {
  if (!order) {
    return (
      <div className="order-details-modal">
        <div className="modal-content">
          <span className="close" onClick={closeModal}>&times;</span>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  const formatDate = (timestamp) => {
      if (timestamp && timestamp.seconds) {
          const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp.seconds * 1000);
          return date.toLocaleString('en-US', {
              weekday: 'long', 
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: true, 
          });
      }
      return 'N/A';
  };

  const calculateTotal = (items) => {
    let total = 0;
    Object.values(items || {}).forEach(item => {
      total += item.price * item.quantity;
    });
    return total.toFixed(2);
  };


  return (
      <div className="order-details-modal">
        <div className="modal-content">
          <span className="close" onClick={closeModal}>&times;</span>
          <div>
            <h1>Order Details</h1>
            <p>Date: {formatDate(order.createdDate)}</p>
            <p>Reference Number: {order.referenceNumber}</p>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Price</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(order.items || {}).map(([itemId, item]) => (
                  <tr key={itemId}>
                    <td>{item.name}</td>
                    <td>{item.description}</td>
                    <td>₱{item.price}</td>
                    <td>{item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className='status'>Status: {order.status}</p>
            <p className="total">Total: ₱{calculateTotal(order.items)}</p>
          </div>
        </div>
      </div>
    );
  };

  
export default OrderHistoryAdmin;
