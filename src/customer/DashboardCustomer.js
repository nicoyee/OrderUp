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

            </div>
        </div>
    );
}
export default DashboardCustomer;