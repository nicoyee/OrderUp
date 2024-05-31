import "../css/DashboardAdmin.css";
import "../css/Dashboard.css";
import "../css/CreateDish.css";
import "../css/Admin/ManageUsers.css";

import React, { useState, useContext } from "react";
import { UserContext } from "../App";
import OrderHistoryAdmin from "./OrderHistoryAdmin";
import HeaderAdmin from "./HeaderAdmin";
import MenuAdmin from "./MenuAdmin";
import CreateDish from "./CreateDish";
import ManageUsers from "./ManageUsers";
import ManageEvents from "./ManageEvents";

const DashboardAdmin = () => {
  const user = useContext(UserContext);
  const [createDishModalIsOpen, setCreateDishModalIsOpen] = useState(false);
  const [manageUsersModalIsOpen, setManageUsersModalIsOpen] = useState(false);
  const [manageEventsModalIsOpen, setManageEventsModalIsOpen] = useState(false);
  const [dishes, setDishes] = useState([]);
  const [events, setEvents] = useState([]);

  return (
    <div className="dashboardContainer">
      <HeaderAdmin user={user} />
      <div className="dashboardContent">
        <div className="dashboardContent-main">
          <div className="dashboardCard cardAdmin">
            <div className="dashboardCardText">
              <span>Dashboard</span>
              <p className="dashboardCardSubtitle">
                Welcome Back,{" "}
                <span className="dashboardCardName nameAdmin">{user.name}</span>
              </p>
            </div>
            <div className="dashboardCardIcons">
              <button
                className="dashboardCardBtn"
                onClick={() => setCreateDishModalIsOpen(true)}
              >
                <span className="material-symbols-outlined">
                  restaurant_menu
                </span>
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
            </div>
          </div>
          <MenuAdmin dishes={dishes} setDishes={setDishes} />
          <OrderHistoryAdmin />
        </div>
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
      </div>
    </div>
  );
};

export default DashboardAdmin;
