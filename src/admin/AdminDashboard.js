import "./css/AdminDashboard.css";
import "../common/css/Dashboard.css";

import { BiSolidDashboard } from "react-icons/bi";
import { FaUserFriends } from "react-icons/fa";
import { MdFastfood } from "react-icons/md";
import { FaBoxes } from "react-icons/fa";
import { MdEventNote } from "react-icons/md";
import { FaMoneyCheckDollar } from "react-icons/fa6";
import { HiOutlineLogin } from "react-icons/hi";

import React, { useState, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';

import { UserContext } from "../App";

import LogOutConfirmation from '../common/LogOutConfirmation.js';

import Header from "./AdminHeader";
import Analytics from "./AdminAnalytics";
import Users from "./AdminUsers";
import Dishes from "./AdminDishes";
import Orders from "./AdminOrders";
import Menu from "./unused/AdminMenu";
import ManageUsers from "./unused/ManageUsers";
import ManageEvents from "./unused/ManageEvents";
import Balance from "./unused/AdminBalance";
import OrderCancellationRequests from "./unused/OrderCancellationRequests";

const AdminDashboard = () => {

  const user = useContext(UserContext);
  const [dashboardContent, setDashboardContent] = useState('overview');
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

      <div id='adminDashboard' className="dashboard">

        <div className="dashboard-nav">

          <h1 className="siteLogo admin">RiceBoy</h1>

          <div className="dashboard-nav-section">
            <ul>
              <li className={dashboardContent === 'overview' ? 'active' : ''} onClick={() => handleNavClick('overview')}><span><BiSolidDashboard /> <a>Overview</a></span></li>
              <li className={dashboardContent === 'users' ? 'active' : ''} onClick={() => handleNavClick('users')}><span><FaUserFriends /> <a>Users</a></span></li>
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

          {dashboardContent === 'overview' && (
            <Analytics />
          )}
          {dashboardContent === 'users' && (
            <Users />
          )}
          {dashboardContent === 'dishes' && (
            <Dishes />
          )}
          {dashboardContent === 'orders' && (
            <Orders />
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

export default AdminDashboard;