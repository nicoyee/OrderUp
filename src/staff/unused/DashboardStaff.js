// import "../admin/css/AdminDashboard.css";
// import "../css/Admin/DashboardAdmin.css";

import React, { useState, useContext } from "react";

import { UserContext } from "../../App";

import MenuStaff from "./MenuStaff";
import OrderHistory from "./OrderHistory";
import ManageEvents from "./ManageEvents";
import BalanceTable from "./BalanceTableStaff";
import OrderCancellationRequestsStaff from "./OrderCancellationRequestsStaff";
// import "../css/Staff/DashboardStaff.css";

import { MdFastfood } from "react-icons/md";
import { FaBoxes } from "react-icons/fa";
import { FaMoneyCheckDollar } from "react-icons/fa6";

const DashboardStaff = () => {
    const user = useContext(UserContext);
    const [dashboardContent, setDashboardContent] = useState('dishes');

    const [dishes, setDishes] = useState([]);
    const [manageEventsModalIsOpen, setManageEventsModalIsOpen] = useState(false);
  
    const handleNavClick = (content) => {
        setDashboardContent(content);
    };

    return (
      <div className="dashboardContainer">

        <Header />

        <div id="adminDashboard">

          <div className="dashboard-nav">
            <div className="dashboard-nav-section">
                <label>Staff Dashboard</label>
                <ul>
                    <li onClick={() => handleNavClick('dishes')}><span><MdFastfood /> <a>Dishes</a></span></li>
                    <li onClick={() => handleNavClick('orders')}><span><FaBoxes /> <a>Orders</a></span></li>
                    <li onClick={() => handleNavClick('balance')}><span><FaMoneyCheckDollar /> <a>Balance</a></span></li>
                </ul>
            </div>
            <div className="dashboard-nav-section">
                <label>Staff Actions</label>
                <ul>
                    <li onClick={() => setManageEventsModalIsOpen(true)}><span><button >Manage Events</button></span></li>
                </ul>
            </div>           
          </div>

          <div className="dashboard-main">
            {dashboardContent === 'dishes' && (
              <MenuStaff dishes={dishes} setDishes={setDishes} />
            )}
            {dashboardContent === 'orders' && (
              <OrderHistory />
            )}
            {dashboardContent === 'balance' && (
                <div className="tableContainer">
                  <BalanceTable />
                  <OrderCancellationRequestsStaff />
                </div>
            )}
          </div>

          {manageEventsModalIsOpen && (
            <ManageEvents
              modalIsOpen={manageEventsModalIsOpen}
              setModalIsOpen={setManageEventsModalIsOpen}
              isStaff={true}
            />
          )}

        </div>
  
      </div>
    );
  };
  
  export default DashboardStaff;