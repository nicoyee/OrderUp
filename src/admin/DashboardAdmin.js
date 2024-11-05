import "../css/Admin/DashboardAdmin.css";
import "./css/AdminDashboard.css";

import React, { useState, useContext } from "react";
import { useNavigate } from 'react-router-dom';


import { UserContext } from "../App";

import OrderHistoryAdmin from "./OrderHistoryAdmin";
import HeaderAdmin from "./HeaderAdmin";
import MenuAdmin from "./MenuAdmin";
import CreateDish from "./CreateDish";
import ManageUsers from "./ManageUsers";
import ManageEvents from "./ManageEvents";
import BalanceTable from "./BalanceTable";
import AdminSales from "./AdminSales"; // Import AdminSales component
import OrderCancellationRequests from "./OrderCancellationRequests";


const DashboardAdmin = () => {
  const user = useContext(UserContext);
  const [createDishModalIsOpen, setCreateDishModalIsOpen] = useState(false);
  const [manageUsersModalIsOpen, setManageUsersModalIsOpen] = useState(false);
  const [manageEventsModalIsOpen, setManageEventsModalIsOpen] = useState(false);
  const [adminSalesModalIsOpen, setAdminSalesModalIsOpen] = useState(false); // State for AdminSales modal
  const [dishes, setDishes] = useState([]);
  const [events, setEvents] = useState([]);
  
  const navigate = useNavigate(); // Initialize useNavigate

  return (
    <div className="dashboardContainer">
      
      <HeaderAdmin user={user} />

      <div id="adminDashboard">
        <div className="adminDashboard-actions">
          <h1 className="sectionHeader">Admin Dashboard</h1>

          <div className="adminDashboard-actions-container">
            <button
              className="dashboardCardBtn"
              onClick={() => setCreateDishModalIsOpen(true)}
            >
              <span className="material-symbols-outlined">restaurant_menu</span>
              Create Dish
            </button>
            <button
              className="dashboardCardBtn"
              onClick={() => setManageUsersModalIsOpen(true)}
            >
              <span className="material-symbols-outlined">person_add</span>
              Manage Users
            </button>
            <button
              className="dashboardCardBtn"
              onClick={() => setManageEventsModalIsOpen(true)}
            >
              <span className="material-symbols-outlined">event</span>
              Manage Events
            </button>
            <button
              className="dashboardCardBtn"
              onClick={() => setAdminSalesModalIsOpen(true)} // Button to open AdminSales modal
            >
              <span className="material-symbols-outlined">bar_chart</span>
              Sales Overview
            </button>
            <button
              className="dashboardCardBtn"
              onClick={() => navigate('/financedashboard')}// Navigate to FinanceDashboard on click
            >
              <span className="material-symbols-outlined">attach_money</span>
              Finance Dashboard
            </button>
          </div>
        </div>

        <MenuAdmin dishes={dishes} setDishes={setDishes} />
        <OrderHistoryAdmin />

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
        {adminSalesModalIsOpen && (
          <AdminSales
            show={adminSalesModalIsOpen}
            handleClose={() => setAdminSalesModalIsOpen(false)}
            userEmail={user.email} // Pass user email for fetching sales data
          />
        )}

        <div className="tableContainer">
          <BalanceTable />
          <OrderCancellationRequests />
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
