import '../css/DashboardAdmin.css';
import '../css/Dashboard.css';

import React, { useState, useContext, useEffect} from 'react';
import { UserContext } from '../App';

import NavigationAdmin from './NavigationAdmin';
import HeaderAdmin from './HeaderAdmin';
import MenuAdmin from './MenuAdmin';
import CreateDish from './CreateDish';
import AddEmployee from './AddEmployee';
import UserManagement from './UserManagement';
import { Button } from 'react-scroll';
import { db } from '../firebase';


const DashboardAdmin = () => {

    const user = useContext(UserContext);   
    const [createDishModalIsOpen, setCreateDishModalIsOpen] = useState(false);
    const [addEmployeeModalIsOpen, setAddEmployeeModalIsOpen] = useState(false);
    const [userManagementModalIsOpen, setUserManagementModalIsOpen] = useState(false);
    const [dishToEdit, setDishToEdit] = useState(null);
    const [customerSection, setCustomerSection] = useState('dashboard');

    const setCreateDishModal = () => {
        setCreateDishModalIsOpen(true);
    };

    const setAddEmployeeModal = () => {
        setAddEmployeeModalIsOpen(true);
    };
    const setUserManagementModal = () => {
        setUserManagementModalIsOpen(true);
    }
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
                            <a className="dashboardCardBtn" href="#">
                                <span class="material-symbols-outlined" onClick={setCreateDishModal}>
                                    restaurant_menu
                                </span>
                                Create Dish
                            </a>
                            <a className="dashboardCardBtn" href="#">
                                <span class="material-symbols-outlined">
                                    person_add
                                </span>
                                Add Employee
                            </a>
                            <a className="dashboardCardBtn" href="#">
                                <span class="material-symbols-outlined">
                                    event
                                </span>
                                Create Event   
                            </a>
                        </div>

<<<<<<< HEAD
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
                        <a className="dashboardCardBtn" href="#" onClick={setAddEmployeeModal}>
                            <span class="material-symbols-outlined">
                                person_add
                            </span>
                            ADD EMPLOYEE
                        </a>
                        <a className="dashboardCardBtn" href="#" onClick={setUserManagementModal}>
                            <span class="material-symbols-outlined">
                                person
                            </span>
                            USER MANAGEMENT
                        </a>
                        <a className="dashboardCardBtn" href="#">
                            <span class="material-symbols-outlined">
                                event
                            </span>
                            CREATE EVENT   
                        </a>
=======
>>>>>>> cc1ea89eb3202b651be6761f3dd38f7e2671c93a
                    </div>

                    <MenuAdmin/>

                </div>

                <CreateDish modalIsOpen={createDishModalIsOpen} setModalIsOpen={setCreateDishModalIsOpen} />
                <AddEmployee modalIsOpen={addEmployeeModalIsOpen} setModalIsOpen={setAddEmployeeModalIsOpen}/>
<<<<<<< HEAD
                <UserManagement modalIsOpen={userManagementModalIsOpen} setModalIsOpen={setUserManagementModalIsOpen}/>
                <MenuAdmin/>
=======

>>>>>>> cc1ea89eb3202b651be6761f3dd38f7e2671c93a
            </div>
        </div>
    );
}
export default DashboardAdmin;