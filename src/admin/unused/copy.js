import "./css/AdminDashboard.css";
import "../common/css/Dashboard.css";

import { MdFastfood } from "react-icons/md";
import { FaBoxes } from "react-icons/fa";
import { FaMoneyCheckDollar } from "react-icons/fa6";
import { BiSolidDashboard } from "react-icons/bi";
import { FaUserFriends } from "react-icons/fa";

import React, { useState, useContext } from "react";
import { useNavigate } from 'react-router-dom';

import { UserContext } from "../App";

import Header from "./unused/AdminHeader";
import Analytics from "./unused/AdminAnalytics";
import Orders from "./unused/AdminOrders";
import Menu from "./unused/AdminMenu";
import CreateDish from "./unused/CreateDish";
import ManageUsers from "./unused/ManageUsers";
import ManageEvents from "./unused/ManageEvents";
import Balance from "./unused/AdminBalance";
import OrderCancellationRequests from "./unused/OrderCancellationRequests";

import AuthController from "../class/controllers/AuthController";

const AdminDashboard = () => {

  const user = useContext(UserContext);

  const [dashboardContent, setDashboardContent] = useState('overview');
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const [dishes, setDishes] = useState([]);
  const [events, setEvents] = useState([]);
  const [createDishModalIsOpen, setCreateDishModalIsOpen] = useState(false);
  const [manageUsersModalIsOpen, setManageUsersModalIsOpen] = useState(false);
  const [manageEventsModalIsOpen, setManageEventsModalIsOpen] = useState(false);
  const [adminSalesModalIsOpen, setAdminSalesModalIsOpen] = useState(false);

  const handleNavClick = (content) => {
      setDashboardContent(content);
  };

  const handleSignOut = () => {
    setIsLogoutModalOpen(true);
  };

  // Confirm and process the logout
  const confirmSignOut = () => {
    AuthController.signOut();
    setIsLogoutModalOpen(false);
  };

  // Cancel logout process
  const cancelSignOut = () => {
    setIsLogoutModalOpen(false);
  };

  const navigate = useNavigate();

  return (

    <div className="dashboardContainer">

      <Header />

      <div id="adminDashboard">

        <div className="dashboard-nav">
          <h1>RiceBoy</h1>
          <div className="dashboard-nav-section">
            <ul>
              <li className={dashboardContent === 'overview' ? 'active' : ''} onClick={() => handleNavClick('overview')}><span><BiSolidDashboard /> <a>Overview</a></span></li>
              <li className={dashboardContent === 'dishes' ? 'active' : ''} onClick={() => handleNavClick('dishes')}><span><MdFastfood /> <a>Menu</a></span></li>
              <li className={dashboardContent === 'orders' ? 'active' : ''} onClick={() => handleNavClick('orders')}><span><FaBoxes /> <a>Orders</a></span></li>
              <li className={dashboardContent === 'cancel' ? 'active' : ''} onClick={() => handleNavClick('cancel')}><span><FaBoxes /> <a>Cancellation</a></span></li>
              <li className={dashboardContent === 'balance' ? 'active' : ''} onClick={() => handleNavClick('balance')}><span><FaMoneyCheckDollar /> <a>Balance</a></span></li>
            </ul>
          </div>
          <div className="dashboard-nav-section">
            <ul>
              <li onClick={() => setCreateDishModalIsOpen(true)}><a>Create Dish</a></li>
              <li onClick={() => setManageUsersModalIsOpen(true)}><a>Manage Users</a></li>
              <li onClick={() => setManageEventsModalIsOpen(true)}><a>Manage Events</a></li>
              <li onClick={() => navigate('/financedashboard')}><a>Finance Dashboard</a></li>
            </ul>

            <div className="dashboard-header-section">
              <h1>{user.email}</h1>
              <button onClick={handleSignOut}>Log Out</button>
            </div>
          </div>

        </div>

        <div className="dashboard-main">
          {dashboardContent === 'overview' && (
            <Analytics />
          )}
          {dashboardContent === 'dishes' && (
            <Menu />
          )}
          {dashboardContent === 'orders' && (
            <Orders />
          )}
          {dashboardContent === 'balance' && (
            <Balance />
          )}
        </div>

      </div>

    {/* Modals */}
    {createDishModalIsOpen && (
        <CreateDish
          setDishes={setDishes}
          modalIsOpen={createDishModalIsOpen}
          setModalIsOpen={setCreateDishModalIsOpen}
        />
      )}
      {manageUsersModalIsOpen && (
        <ManageUsers
          modalIsOpen={manageUsersModalIsOpen}
          setModalIsOpen={setManageUsersModalIsOpen}
        />
      )}
      {manageEventsModalIsOpen && (
        <ManageEvents
          setEvents={setEvents}
          modalIsOpen={manageEventsModalIsOpen}
          setModalIsOpen={setManageEventsModalIsOpen}
        />
      )}

      {isLogoutModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
              <p>Are you sure you want to log out?</p>
              <div className="modal-buttons">
              <button className="modal-confirm" onClick={confirmSignOut}>
                  Yes
              </button>
              <button className="modal-cancel" onClick={cancelSignOut}>
                  No
              </button>
              </div>
          </div>
        </div>
      )}
            
    </div>
  );
};

export default AdminDashboard;