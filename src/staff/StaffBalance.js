import React, { useEffect, useState, useContext } from 'react';

import BalanceTable from './StaffBalanceBalanceTable.js';
import CancellationRequests from './StaffBalanceCancellationRequests.js';

const StaffBalance = () => {

    return (
        <div id="staffBalance" className="dashboard-content">

            <div className="dashboard-section">

                <div className="userInfo staff">
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

export default StaffBalance;