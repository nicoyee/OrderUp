import "../css/DashboardCard.css";
import React, { useState, useContext } from "react";
import { UserContext } from "../App";
import HeaderStaff from "./HeaderStaff";
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
        <div className="dashboardContent">
          <div className="dashboardContent-main">
            <div className="dashboardCard cardStaff">
              <div className="dashboardCardText">
                <span>Dashboard</span>
                <p className="dashboardCardSubtitle">
                  Welcome Back,{" "}
                  <span className="dashboardCardName nameStaff">{user.name}</span>
                </p>
              </div>
              <div className="dashboardCardIcons">
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
      </div>
    );
  };
  
  export default DashboardStaff;