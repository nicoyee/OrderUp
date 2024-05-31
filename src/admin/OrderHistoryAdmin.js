import '../css/common/dashboardComponents.css';
import '../css/common/dataTable.css';

import { db } from "../firebase";

import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import Modal from 'react-modal';

const OrderHistoryAdmin = () => {

  const [ modal, showModal ] = useState(false);

  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selectedDocumentId, setSelectedDocumentId] = useState(null);
  const [orderIds, setOrderIds] = useState([]);

  useEffect(() => {
    const fetchOrderIds = async () => {
      try {
        const ordersRef = collection(db, "Orders");
        const snapshot = await getDocs(ordersRef);
        const allOrders = [];

        for (const docRef of snapshot.docs) {
          const orderIdRef = collection(docRef.ref, "orders");
          const orderIdSnapshot = await getDocs(orderIdRef);
          orderIdSnapshot.forEach((orderDoc) => {
            allOrders.push({
              orderId: orderDoc.id,
              documentId: docRef.id,
              status: orderDoc.data().status, // Fetch and store the status
            });
          });
        }
        setOrderIds(allOrders);
      } catch (error) {
        console.error("Error fetching order IDs:", error);
      }
    };

    fetchOrderIds();
  }, []);

  const openModal = (orderId, documentId) => {
    if (documentId) {
      // Check if documentId is available
      setSelectedOrderId(orderId);
      setSelectedDocumentId(documentId);
      showModal(true);
      document.body.classList.add('modal-open');
    } else {
      console.error("Document ID not yet available");
    }
  };

  const closeModal = () => {
    setSelectedOrderId(null);
    showModal(false);
    document.body.classList.remove('modal-open');
  };

  const handleStatusChange = async (orderId, documentId, newStatus) => {
    try {
      // Reference to the specific order document
      const orderRef = doc(db, "Orders", documentId, "orders", orderId);

      // Update the status field in the order document
      await updateDoc(orderRef, { status: newStatus });

      console.log("Order status updated successfully.");
      
      // Update the local state to reflect the new status
      setOrderIds((prevOrders) =>
        prevOrders.map((order) =>
          order.orderId === orderId && order.documentId === documentId
            ? { ...order, status: newStatus }
            : order
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  return (
    <div className='sectionContent'>
      <div className='sectionContent-header'>
        <h1>Orders</h1>
      </div>
      <div className='dataTable-container'>
        <table className='dataTable'>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>View</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orderIds.map((order) => (
              <tr key={order.orderId}>
                <td>{order.orderId}</td>
                <td>{order.documentId}</td>
                <td>
                  <div className='dataTable-actions'>
                    <button onClick={() => openModal(order.orderId, order.documentId)}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>eye</title><path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z" /></svg>
                    </button>
                  </div>
                </td>
                <td>
                  <select
                    value={order.status} // Set the default value to the status
                    onChange={(e) =>
                      handleStatusChange(
                        order.orderId,
                        order.documentId,
                        e.target.value
                      )
                    }
                  >
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                    <option value="done">Done</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={ modal }
        onRequestClose={ closeModal }
        className={`${ modal ? 'modal-open' : '' }`}
        overlayClassName="modalOverlay"
      >
        <OrderModal
          orderId={selectedOrderId}
          closeModal={closeModal}
          documentId={selectedDocumentId}
        />
      </Modal>

    </div>
  );
};

const OrderModal = ({ orderId, closeModal, documentId }) => {

  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const orderRef = doc(db, "Orders", documentId, "orders", orderId);
        const orderDoc = await getDoc(orderRef);
        if (orderDoc.exists()) {
          setOrderDetails(orderDoc.data());
        } else {
          console.error("Order not found");
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };

    fetchOrderDetails();
  }, [orderId, documentId]);

  return (
    <div id='viewOrderDetails' className='modalForm'>

      <div className='modalForm-header'>
        <span>
          <h1>Order Details</h1>
          <svg
              onClick={closeModal}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </span>
        <h2>{orderId}</h2>
      </div>
      
      <div className='adminDisplay-body'>

          <div className='adminDisplay-section'>
            <label>Date</label>
            <h1>
              {orderDetails && orderDetails.date.toDate().toLocaleString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              })}
            </h1>
          </div>

          <div className='adminDisplay-section'>
            <label>Order Items</label>
            <div className='adminDisplay-table'>
              <table className='dataTable'>
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Price</th>
                        <th>Quantity</th>
                    </tr>
                </thead>
                <tbody>
                  {orderDetails && Object.values(orderDetails.items).map((item, index) => (
                    <tr key={`${item.id}-${index}`}>
                      <td>{item.name}</td>
                      <td>${item.price}</td>
                      <td>{item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

    </div>
  );

}

export default OrderHistoryAdmin;
