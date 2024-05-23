import '../css/DashboardAdmin.css';
import '../css/Dashboard.css';
import '../css/CreateDish.css'
import '../css/Admin/ManageUsers.css'; 

import React, { useState, useContext } from 'react';
import { UserContext } from '../App';

import NavigationAdmin from './NavigationAdmin';
import HeaderAdmin from './HeaderAdmin';
import MenuAdmin from './MenuAdmin';
import CreateDish from './CreateDish';
import ManageUsers from './ManageUsers';

const DashboardAdmin = () => {
    const user = useContext(UserContext);   
    const [createDishModalIsOpen, setCreateDishModalIsOpen] = useState(false);

    const [manageUsersModalIsOpen, setManageUsersModalIsOpen] = useState(false);

    const [dishes, setDishes] = useState([])

    // Function to open Create Dish modal
    const openCreateDishModal = () => {
        setCreateDishModalIsOpen(true);
    };

    // Function to close Create Dish modal
    const closeCreateDishModal = () => {
        setCreateDishModalIsOpen(false);
    };

    // Function to open Add Employee modal
    const openManageUsersModal = () => {
        setManageUsersModalIsOpen(true);
    };

    // Function to close Add Employee modal
    const closeManageUsersModal = () => {
        setManageUsersModalIsOpen(false);
    };

    return (
        <div className='dashboardContainer'>
            <HeaderAdmin user={ user } />
            <div className='dashboardContent'>
                <div className='dashboardContent-main '>
                    <div className="dashboardCard cardAdmin">
                        <div className="dashboardCardText">
                            <span>Dashboard</span>
                            <p className="dashboardCardSubtitle">Welcome Back, <span className='dashboardCardName nameAdmin'>{ user.name }</span></p>
                        </div>
                        <div className="dashboardCardIcons">
                            <button className="dashboardCardBtn" onClick={openCreateDishModal}>
                                <span className="material-symbols-outlined">restaurant_menu</span>
                                Create Dish
                            </button>
                            <button className="dashboardCardBtn" onClick={openManageUsersModal}>
                                <span className="material-symbols-outlined">person_add</span>
                                Manage Users
                            </button>
                            <button className="dashboardCardBtn" >
                                <span className="material-symbols-outlined">event</span>
                                Create Event   
                            </button>
                        </div>
                    </div>
                    <MenuAdmin dishes={dishes} setDishes={setDishes}/>
                </div>
                {createDishModalIsOpen && <CreateDish setDishes={setDishes} modalIsOpen={createDishModalIsOpen} setModalIsOpen={closeCreateDishModal} />}
                {manageUsersModalIsOpen && <ManageUsers modalIsOpen={manageUsersModalIsOpen} setModalIsOpen={closeManageUsersModal} />}
            </div>
        </div>
    );
}

export default DashboardAdmin;