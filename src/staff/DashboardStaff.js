import "../admin/css/AdminDashboard.css";
import "../css/Admin/DashboardAdmin.css";

import React, { useState, useContext } from "react";

import { UserContext } from "../App";

import HeaderStaff from "../admin/HeaderAdmin";
import MenuStaff from "./MenuStaff";
import OrderHistory from "./OrderHistory";
import ManageEvents from "./ManageEvents";
import BalanceTable from "./BalanceTableStaff";
import OrderCancellationRequestsStaff from "./OrderCancellationRequestsStaff";
// import "../css/Staff/DashboardStaff.css";

const DashboardStaff = () => {
    const user = useContext(UserContext);
    const [dishes, setDishes] = useState([]);
    const [manageEventsModalIsOpen, setManageEventsModalIsOpen] = useState(false);
  
    return (
      <div className="dashboardContainer">

        <HeaderStaff user={user} />

        <div id="adminDashboard">

          <div className="adminDashboard-actions">

            <h1 className="sectionHeader">Staff Dashboard</h1>

            <div className="adminDashboard-actions-container">

              <button
                className="dashboardCardBtn"
                onClick={() => setManageEventsModalIsOpen(true)}
              >
                <span className="material-symbols-outlined">event</span>
                Manage Events
              </button>

            </div>
            
          </div>

          <MenuStaff dishes={dishes} setDishes={setDishes} />
          <OrderHistory />

          {manageEventsModalIsOpen && (
            <ManageEvents
              modalIsOpen={manageEventsModalIsOpen}
              setModalIsOpen={setManageEventsModalIsOpen}
              isStaff={true}
            />
          )}

          <div className="tableContainer">
            <BalanceTable />
            <OrderCancellationRequestsStaff />
          </div>

        </div>
  
      </div>
    );
  };
  
  export default DashboardStaff;