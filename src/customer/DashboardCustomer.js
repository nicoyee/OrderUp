import '../css/DashboardCustomer.css';
import '../css/Dashboard.css';

import React, { useState, useContext } from 'react';
import { UserContext } from '../App';

import NavigationCustomer from './NavigationCustomer';
import HeaderCustomer from './HeaderCustomer';

const DashboardCustomer = () => {

    const user = useContext(UserContext);
    
    const [customerSection, setCustomerSection] = useState('dashboard');

    return (
        <div className='dashboardContainer'>

            <NavigationCustomer />

            <div className='dashboardContent'>

                <HeaderCustomer user={ user } />

                <div className="dashboardCard">
                    <div className="dashboardCardText">
                        <span>Dashboard</span>
                        <p className="dashboardCardSubtitle">Welcome Back, <span className='dashboardCardName'>{ user.name }</span></p>
                    </div>
                    <div className="dashboardCardIcons">
                        <a className="dashboardCardBtn" href="#">
                            <span class="material-symbols-outlined">
                                room_service
                            </span>
                            ORDER
                        </a>
                        <a className="dashboardCardBtn" href="#">
                            <span class="material-symbols-outlined">
                                confirmation_number
                            </span>
                            ADD VOUCHER
                        </a>
                    </div>
                </div>

            </div>
        </div>
    );
}
export default DashboardCustomer;