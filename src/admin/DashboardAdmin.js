import '../css/DashboardAdmin.css';
import '../css/Dashboard.css';
import '../css/CreateDish.css'

import React, { useState, useContext } from 'react';
import { UserContext } from '../App';

import NavigationAdmin from './NavigationAdmin';
import HeaderAdmin from './HeaderAdmin';
import MenuAdmin from './MenuAdmin';
import CreateDish from './CreateDish';
import { Button } from 'react-scroll';

const DashboardAdmin = () => {

    const user = useContext(UserContext);   
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalContent, setModalContent] = useState('createDish');
    const [dishToEdit, setDishToEdit] = useState(null);
    const [customerSection, setCustomerSection] = useState('dashboard');

    const closeModal = () => {
        setModalIsOpen(false);
      };
    
      const setCreateDishModal = () => {
        setModalContent('createDish');
        setModalIsOpen(true);
      };
    return (
        <div className='dashboardContainer'>

            <NavigationAdmin />

            <div className='dashboardContent'>

                <HeaderAdmin user={ user } />

                <div className="dashboardCard cardAdmin">
                    <div className="dashboardCardText">
                        <span>Dashboard</span>
                        <p className="dashboardCardSubtitle">Welcome Back, <span className='dashboardCardName nameAdmin'>{ user.name }</span></p>
                    </div>
                    <div className="dashboardCardIcons">
                        <a className="dashboardCardBtn" href="#" onClick={setCreateDishModal}>
                            <span class="material-symbols-outlined">
                                restaurant_menu
                            </span>
                            ADD DISH
                        </a>
                        <a className="dashboardCardBtn" href="#">
                            <span class="material-symbols-outlined">
                                person_add
                            </span>
                            ADD EMPLOYEE
                        </a>
                        <a className="dashboardCardBtn" href="#">
                            <span class="material-symbols-outlined">
                                event
                            </span>
                            CREATE EVENT   
                        </a>
                    </div>
                </div>
                <CreateDish modalIsOpen={modalIsOpen} setModalIsOpen={setModalIsOpen} />
                <MenuAdmin/>
            </div>
        </div>
    );
}
export default DashboardAdmin;