import '../css/DashboardAdmin.css';
import '../css/Dashboard.css';

import React, { useState, useContext } from 'react';
import { UserContext } from '../App';
import Modal from 'react-modal';
import NavigationAdmin from './NavigationAdmin';
import HeaderAdmin from './HeaderAdmin';

import MenuAdmin from './MenuAdmin';

const DashboardAdmin = () => {

    const user = useContext(UserContext);
    
    const [adminSection, setAdminSection] = useState('dashboard');


    return (
        <div className='dashboardContainer'>

            <NavigationAdmin />

            <div className='dashboardContent'>

                <HeaderAdmin user={ user } />

            </div>

            <MenuAdmin />
        </div>
    );
}
export default DashboardAdmin;