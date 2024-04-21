import '../css/DashboardAdmin.css';
import '../css/Dashboard.css';

import React, { useState, useContext } from 'react';
import { UserContext } from '../App';

import NavigationAdmin from './NavigationAdmin';
import HeaderAdmin from './HeaderAdmin';

const DashboardCustomer = () => {

    const user = useContext(UserContext);
    
    const [customerSection, setCustomerSection] = useState('dashboard');

    return (
        <div className='dashboardContainer'>

            <NavigationAdmin />

            <div className='dashboardContent'>

                <HeaderAdmin user={ user } />

            </div>
        </div>
    );
}
export default DashboardCustomer;