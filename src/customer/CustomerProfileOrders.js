import "./css/CustomerProfileOrders.css";
import "../common/css/Data.css";

import { FaBoxesStacked } from "react-icons/fa6";

import React, { useContext, useState, useEffect } from "react";
import { toast, Flip } from 'react-toastify';
import Modal from 'react-modal';

import { UserContext } from "../App";
import OrderController from "../class/controllers/OrderController"; 
import PaymentController from "../class/controllers/PaymentController";

import OrderInfo from "./CustomerProfileOrderInfo";
import OrderStatusIndicator from "../common/OrderStatusIndicator";

const CustomerProfileOrders = () => {

  const user = useContext(UserContext);

  const [ modal, showModal ] = useState(false);
  const [ selectedOrder, setSelectedOrder ] = useState(null);
  const [ userOrders, setUserOrders ] = useState([]);

  useEffect(() => {
      const fetchUserOrders = async () => {
        try {
          if (!user) return;
          const orders = await OrderController.viewHistory(user.email);
          orders.sort((a, b) => b.createdDate.seconds - a.createdDate.seconds);
          setUserOrders(orders);
        } catch (error) {
          console.error("Error fetching user orders:", error);
        }
      };
      fetchUserOrders();
  }, [user]);

  const handleViewOrder = (order) => {
      setSelectedOrder(order);
      showModal(true);
      document.body.classList.add('modal-open');
  };
  
  const handleCloseOrder = () => {
      setSelectedOrder(null);
      showModal(false);
      document.body.classList.remove('modal-open');
  };

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
          hour12: true,
        });
      }
      return 'N/A';
  };

  const handleCancelOrder = async (order) => {
    try {
      await OrderController.requestCancellation(user.email, order.referenceNumber);
      await OrderController.updateStatus(user.email, order.referenceNumber, "cancellation-requested");
      toast.success(`Cancellation request has been sent!`, {
        position: "bottom-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Flip,
      });

      setUserOrders(prevOrders =>
        prevOrders.map(o =>
          o.referenceNumber === order.referenceNumber
            ? { ...o, status: "cancellation-requested" }
            : o
        )
      );

      setSelectedOrder((prevSelectedOrder) =>
        prevSelectedOrder && prevSelectedOrder.referenceNumber === order.referenceNumber
          ? { ...prevSelectedOrder, status: "cancellation-requested" }
          : prevSelectedOrder
      );

      
    } catch (error) {
      console.error("Error requesting cancellation:", error);
    }
  };

  const handleRefundRequest = async (order) => {
    if (order && order.status === "downpayment-paid") {
      try {
        await OrderController.requestRefund(user.email, order.referenceNumber);
        await OrderController.updateStatus(user.email, order.referenceNumber, "refund-requested");
        toast.success(`Refund request has been sent!`, {
          position: "bottom-center",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Flip,
        });

        // Update the userOrders state
        setUserOrders(prevOrders =>
            prevOrders.map(o =>
                o.referenceNumber === order.referenceNumber
                    ? { ...o, status: "refund-requested" }
                    : o
            )
        );
      } catch (error) {
        console.error("Error requesting refund:", error);
      }
    } else if (order && order.status === "refund-requested") {
        alert("Refund request has already been sent for this order.");
    }
  };

  if (!user) {
      return <div>Loading...</div>;
  }

  return (
      <div id='customerProfileOrders' className="dataCard">

          <div className="dataCard-header">
            <div className="dataCard-header-left">
              <FaBoxesStacked />
              <h1>My Orders</h1>
            </div>
          </div>

          <div className="dataCard-table-full">

              <table>
                  <thead>
                  <tr>
                      <th>Reference #</th>
                      <th>Status</th>
                      <th>Date</th>
                  </tr>
                  </thead>

                  <tbody>
                    {userOrders.map((order) => (
                      <tr key={order.referenceNumber} onClick={() => handleViewOrder(order)}>
                        <td className='refNum'>{order.referenceNumber}</td>
                        <td><OrderStatusIndicator status={order.status} /></td>
                        <td>{formatDate(order.createdDate)}</td>
                      </tr>
                    ))}
                  </tbody>
              </table>

          </div>

          <div className="dataCard-footer">

          </div>

          <Modal
            isOpen={ modal }
            onRequestClose={ handleCloseOrder }
            className={`orderInfoModal ${ modal ? 'modal-open' : '' }`}
            overlayClassName="modalOverlay"
          >
            {selectedOrder && ( 
              <OrderInfo 
                handleCloseOrder = { handleCloseOrder }
                handleCancelOrder={ handleCancelOrder }
                handleRefundRequest={ handleRefundRequest }
                order = { selectedOrder } 
              />
            )} 
          </Modal>

      </div>
  );
    
};

export default CustomerProfileOrders;