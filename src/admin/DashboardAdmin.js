import '../css/DashboardAdmin.css';
import '../css/Dashboard.css';

import React, { useState, useContext } from 'react';
import { UserContext } from '../App';

import NavigationAdmin from './NavigationAdmin';
import HeaderAdmin from './HeaderAdmin';

const DashboardAdmin = () => {

    const user = useContext(UserContext);
    
    const [customerSection, setCustomerSection] = useState('dashboard');

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
                        <a className="dashboardCardBtn" href="#">
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

            </div>
        </div>
    );
}
export default DashboardAdmin;