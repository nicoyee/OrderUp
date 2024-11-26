import "../common/css/Dashboard.css";

import { MdFastfood } from "react-icons/md";
import { FaBoxes } from "react-icons/fa";
import { MdEventNote } from "react-icons/md";
import { FaMoneyCheckDollar } from "react-icons/fa6";
import { HiOutlineLogin } from "react-icons/hi";

import React, { useState, useContext } from "react";
import Modal from 'react-modal';

import { UserContext } from "../App";

import LogOutConfirmation from '../common/LogOutConfirmation.js';

import Header from "./StaffHeader.js";
import Dishes from "./StaffDishes.js";
import Orders from "./StaffOrders.js";
import Events from "./StaffEvents.js";
import Balance from "./StaffBalance.js";

const StaffDashboard = () => {

  const user = useContext(UserContext);
  const [dashboardContent, setDashboardContent] = useState('dishes');
  const [ modal, showModal ] = useState(false);

  const openModal = () => {
      showModal(true);
      document.body.classList.add('modal-open');
  };

  const closeModal = () => {
      showModal(false);
      document.body.classList.remove('modal-open');
  };

  const handleNavClick = (content) => {
    setDashboardContent(content);
  };

  return (

    <div className="dashboardContainer">

        <Header />

        <div id='staffDashboard' className="dashboard">

        <div className="dashboard-nav">

          <h1 className="siteLogo staff">RiceBoy</h1>

          <div className="dashboard-nav-section">
            <ul>
              <li className={dashboardContent === 'dishes' ? 'active' : ''} onClick={() => handleNavClick('dishes')}><span><MdFastfood /> <a>Dishes</a></span></li>
              <li className={dashboardContent === 'orders' ? 'active' : ''} onClick={() => handleNavClick('orders')}><span><FaBoxes /> <a>Orders</a></span></li>
              <li className={dashboardContent === 'events' ? 'active' : ''} onClick={() => handleNavClick('events')}><span><MdEventNote /> <a>Events</a></span></li>
              <li className={dashboardContent === 'balance' ? 'active' : ''} onClick={() => handleNavClick('balance')}><span><FaMoneyCheckDollar /> <a>Balance</a></span></li>
            </ul>
          </div>

          <div className="dashboard-nav-section">
            <h2>{user.email}</h2>
            <ul>
              <li onClick={ openModal }><span><HiOutlineLogin /> <a>Log out</a></span></li>
            </ul>
          </div>

        </div>
        <div className="dashboard-main">


          {dashboardContent === 'dishes' && (
            <Dishes />
          )}
          {dashboardContent === 'orders' && (
            <Orders />
          )}
          {dashboardContent === 'events' && (
            <Events />
          )}
          {dashboardContent === 'balance' && (
            <Balance />
          )}

        </div>

      </div>

      <Modal
          isOpen={ modal }
          onRequestClose={ closeModal }
          className={`${ modal ? 'modal-open' : '' }`}
          overlayClassName="modalOverlay"
      >
          <LogOutConfirmation closeModal={ closeModal } />
      </Modal>
  
    </div>
  );
};

export default StaffDashboard;