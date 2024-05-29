import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";

const OrderHistoryAdmin = () => {
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
    } else {
      console.error("Document ID not yet available");
    }
  };

  const closeModal = () => {
    setSelectedOrderId(null);
  };

  const handleStatusChange = async (orderId, documentId, newStatus) => {
    try {
      // Reference to the specific order document
      const orderRef = doc(db, "Orders", documentId, "orders", orderId);

      // Update the status field in the order document
      await updateDoc(orderRef, { status: newStatus });

      console.log("Order status updated successfully.");
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  return (
    <div className="menuTable">
      <h1>User Orders</h1>
      <table className="dataTableHistory">
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
                <button
                  onClick={() => openModal(order.orderId, order.documentId)}
                >
                  View
                </button>
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
      {selectedOrderId && selectedDocumentId && (
        <Modal
          orderId={selectedOrderId}
          closeModal={closeModal}
          documentId={selectedDocumentId}
        />
      )}
    </div>
  );
};

const Modal = ({ orderId, closeModal, documentId }) => {
  // Fetch the full order details based on orderId
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
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={closeModal}>
          &times;
        </span>
        {orderDetails && (
          <div>
            <p>
              Date:{" "}
              {orderDetails.date.toDate().toLocaleString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              })}
            </p>
            <p>Reference Number: {orderDetails.referenceNumber}</p>
            <h3>Items:</h3>
            <ul>
              {Object.values(orderDetails.items).map((item, index) => (
                <li key={`${item.id}-${index}`}>
                  <p>Name: {item.name}</p>
                  <p>Description: {item.description}</p>
                  <p>Price: ${item.price}</p>
                  <p>Quantity: {item.quantity}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryAdmin;
