import '../../css/pages/dashboard/DashboardHeader.css';

import React from "react";
import { Avatar } from '@chakra-ui/react';

const DashboardHeader = () => {
  
  return (
    <div id='dashboardHeader'>

        <div className='dashboardHeader-left'>

          <h1>RiceBoy</h1>

        </div>

        <div className='dashboardHeader-right'>
          <span>
            <h2>nicholasyee159@gmail.com</h2>
            <Avatar name='John Doe' sx={{ '--avatar-font-size': '1rem' }} />
          </span>
        </div>

    </div>
  );
};

export default DashboardHeader;