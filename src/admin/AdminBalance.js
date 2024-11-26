import React from 'react';

import BalanceTable from './AdminBalanceBalanceTable.js';
import CancellationRequests from './AdminBalanceCancellationRequests.js';

const AdminBalance = () => {

    return (
        <div id="adminBalance" className="dashboard-content">

            <div className="dashboard-section">

                <div className="userInfo admin">
                    <span className="vertical">
                        <h1>Dashboard</h1>
                        <h3>Balance</h3>
                    </span>
                </div>

            </div>

            <div className="dashboard-section">
                <CancellationRequests />   
            </div>

            <div className="dashboard-section">
                <BalanceTable />
            </div>

        </div>
    );

};

export default AdminBalance;