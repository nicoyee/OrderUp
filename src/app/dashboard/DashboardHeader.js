import './css/DashboardHeader.css';
import CustomerCart from "../../customer/CustomerCart";

import { LuUserCircle2 } from "react-icons/lu";
import { TbLogout } from "react-icons/tb";

import React, { useState } from "react";
import { Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
} from '@chakra-ui/react';
import AuthController from '../../../class/auth/AuthController';



const DashboardHeader = ({ user, dashboardSection, setDashboardSection }) => {

  const [size, setSize] = React.useState('');
  const { isOpen: navDrawerIsOpen, onOpen: openNavDrawer, onClose: closeNavDrawer } = useDisclosure();
  
  const handleSignOut = () => {
    AuthController.signOut();
  };

  return (
    <div id='dashboardHeader'>

        <div className='dashboardHeader-left'>

          <div className='dashboardHeader-navDrawer'>

            <input className="check-icon" id="navHeaderDrawer" type="checkbox" />
              <label id="icon-menu" for="navHeaderDrawer" onClick={ openNavDrawer }>
                  <div class="bar bar--1"></div>
                  <div class="bar bar--2"></div>
                  <div class="bar bar--3"></div>
              </label>

              <Drawer placement='top' onClose={ closeNavDrawer } isOpen={ navDrawerIsOpen }>
                <DrawerOverlay />
                <DrawerContent>
                  <DrawerHeader>Basic Drawer</DrawerHeader>
                  <DrawerBody>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                  </DrawerBody>
                </DrawerContent>
              </Drawer>

          </div>

          <h1>RiceBoy</h1>
        </div>

        { (user.userType === 'admin' || user.userType === 'staff') && (
        
          <div className='dashboardHeader-center'>
            <div className='dashboardHeader-nav'>
              <button onClick={() => setDashboardSection('orders')} className={dashboardSection === 'orders' ? 'navActive' : ''} >Orders</button>
              <button onClick={() => setDashboardSection('users')} className={dashboardSection === 'users' ? 'navActive' : ''} >Users</button>
              <button onClick={() => setDashboardSection('menu')} className={dashboardSection === 'menu' ? 'navActive' : ''} >Menu</button>
              <button onClick={() => setDashboardSection('events')} className={dashboardSection === 'events' ? 'navActive' : ''} >Events</button>
            </div>
          </div>
        
        )}

        <div className='dashboardHeader-right'>
          
          { user.userType === "customer" && (<CustomerCart />) }
          
          <Menu id='profileIcon' placement='bottom-end' zIndex='100'>
            <MenuButton >
              <Avatar name={user.name} src={ user.profilePicture } sx={{ '--avatar-font-size': '1.5rem' }} />
            </MenuButton>
            <MenuList minW="0" w="140px">
              <MenuItem> <div id='profileDropdown'> <LuUserCircle2 /> Profile </div></MenuItem>
              <MenuItem> <div id='profileDropdown' onClick={ handleSignOut }> <span><TbLogout /></span> Log Out </div></MenuItem>
            </MenuList>
          </Menu> 
        </div>

    </div>
  );
};

export default DashboardHeader;