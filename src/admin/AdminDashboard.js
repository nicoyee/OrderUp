import "./css/AdminDashboard.css";

import React, { useState, useContext } from "react";
import { useNavigate } from 'react-router-dom';

import { UserContext } from "../App";

import OrderHistoryAdmin from "./OrderHistoryAdmin";
import HeaderAdmin from "./HeaderAdmin";
import AdminMenu from "./AdminMenu";
import CreateDish from "./CreateDish";
import ManageUsers from "./ManageUsers";
import ManageEvents from "./ManageEvents";
import BalanceTable from "./BalanceTable";
import AdminSales from "./AdminSales";
import OrderCancellationRequests from "./OrderCancellationRequests";

import { MdFastfood } from "react-icons/md";
import { FaBoxes } from "react-icons/fa";
import { FaMoneyCheckDollar } from "react-icons/fa6";

const AdminDashboard = () => {

    const user = useContext(UserContext);
    const [dashboardContent, setDashboardContent] = useState('dishes');

    const [dishes, setDishes] = useState([]);
    const [events, setEvents] = useState([]);
    const [createDishModalIsOpen, setCreateDishModalIsOpen] = useState(false);
    const [manageUsersModalIsOpen, setManageUsersModalIsOpen] = useState(false);
    const [manageEventsModalIsOpen, setManageEventsModalIsOpen] = useState(false);
    const [adminSalesModalIsOpen, setAdminSalesModalIsOpen] = useState(false);

    const handleNavClick = (content) => {
        setDashboardContent(content);
    };

    const navigate = useNavigate();

    return (

        <div className="dashboardContainer">

            <HeaderAdmin user={user} />

            <div id="adminDashboard">
                <div className="dashboard-nav">
                    <div className="dashboard-nav-section">
                        <label>Admin Dashboard</label>
                        <ul>
                            <li onClick={() => handleNavClick('dishes')}><span><MdFastfood /> <a>Dishes</a></span></li>
                            <li onClick={() => handleNavClick('orders')}><span><FaBoxes /> <a>Orders</a></span></li>
                            <li onClick={() => handleNavClick('balance')}><span><FaMoneyCheckDollar /> <a>Balance</a></span></li>
                        </ul>
                    </div>
                    <div className="dashboard-nav-section">
                        <label>Admin Actions</label>
                        <ul>
                            <li onClick={() => setCreateDishModalIsOpen(true)}><span><button>Create Dish</button></span></li>
                            <li onClick={() => setManageUsersModalIsOpen(true)}><span><button>Manage Users</button></span></li>
                            <li onClick={() => setManageEventsModalIsOpen(true)}><span><button >Manage Events</button></span></li>
                            <li onClick={() => setAdminSalesModalIsOpen(true)}><span><button>Sales Overview</button></span></li>
                            <li onClick={() => navigate('/financedashboard')}><span><button>Finance Dashboard</button></span></li>
                        </ul>
                    </div>
                    
                </div>
                <div className="dashboard-main">
                    {dashboardContent === 'dishes' && (
                        <AdminMenu dishes={dishes} setDishes={setDishes} />
                    )}
                    {dashboardContent === 'orders' && (
                        <OrderHistoryAdmin />
                    )}
                    {dashboardContent === 'balance' && (
                        <div className="balanceContainer">
                            <BalanceTable />
                            <OrderCancellationRequests />
                        </div>
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
        {adminSalesModalIsOpen && (
          <AdminSales
            show={adminSalesModalIsOpen}
            handleClose={() => setAdminSalesModalIsOpen(false)}
            userEmail={user.email} // Pass user email for fetching sales data
          />
        )}

        </div>

    );

};

export default AdminDashboard;