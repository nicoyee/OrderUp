import '../css/DashboardAdmin.css';

import React from 'react';

import NavigationAdmin from './NavigationAdmin';

const DashboardAdmin = () => {
  return (
    <div className='dashboardAdmin'>

      <NavigationAdmin />

      <div className='adminContent'>
        <h1>Dashboard Admin</h1>
      </div>
    </div>
  );
};

export default DashboardAdmin;