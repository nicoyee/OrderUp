import '../css/DashboardAdmin.css';
import '../css/Dashboard.css';

import HeaderAdmin from './HeaderAdmin';
import MenuAdmin from './MenuAdmin';
import CreateDish from './CreateDish';
import CreateEmployee from './CreateEmployee';
import CreateEvent from './CreateEvent';
import ManageUsers from './ManageUsers';
import ManageEvents from './ManageEvents';
import ManageOrders from './OrderHistoryAdmin';

import React, { useState, useContext } from 'react';
import Modal from 'react-modal';

import { UserContext } from '../App';
import NavigationAdmin from './NavigationAdmin';



const DashboardAdmin = () => {

    const user = useContext(UserContext);

    const [manageEventsModalIsOpen, setManageEventsModalIsOpen] = useState(false);

    const [ dishes, setDishes ] = useState([]);
    const [ events, setEvents ] = useState([]);
    const [ activeSection, setActiveSection ] = useState('menu');

    const [ modal, showModal ] = useState(false);
    const [ modalContent, setModalContent ] = useState('login');

    const closeModal = () => {
        showModal(false);
        document.body.classList.remove('modal-open');
    };

    const setModalCreateEmployee = () => {
        setModalContent('createEmployee');
        showModal(true);
        document.body.classList.add('modal-open');
    };
    
    const setModalCreateDish = () => {
        setModalContent('createDish');
        showModal(true);
        document.body.classList.add('modal-open');
    };
    
    const setModalCreateEvent = () => {
        setModalContent('createEvent');
        showModal(true);
        document.body.classList.add('modal-open');
    };

    return (
        <div className='dashboardContainer'>
            <HeaderAdmin user={user} />
            <div className='dashboardContent'>
                <Modal
                    isOpen={ modal }
                    onRequestClose={ closeModal }
                    className={`${ modal ? 'modal-open' : '' }`}
                    overlayClassName="modalOverlay"
                >

                    { modalContent === "createDish" && ( <CreateDish closeModal={closeModal} /> )}
                    { modalContent === "createEmployee" && ( <CreateEmployee closeModal={closeModal} /> )}
                    { modalContent === "createEvent" && ( <CreateEvent closeModal={closeModal} /> )}

                </Modal>
                <div className='dashboardContent-main'>

                        <div className='dashboardNav navAdmin'>
                            <div className='dashboardNav-top'>
                                <h1>Dashboard</h1>
                                <h2>Welcome Back, <span>{ user.name }</span></h2>
                            </div>
                            <div className='dashboardNav-bottom'>
                                <div onClick={() => setActiveSection('menu')} className={`dashboardNav-btn ${ activeSection === 'menu' ? 'active' : ''}`}>
                                    <h1>Menu</h1>
                                </div>
                                <div onClick={() => setActiveSection('orders')} className={`dashboardNav-btn ${ activeSection === 'orders' ? 'active' : ''}`}>
                                    <h1>Orders</h1>
                                </div>
                                <div onClick={() => setActiveSection('users')} className={`dashboardNav-btn ${ activeSection === 'users' ? 'active' : ''}`}>
                                    <h1>Users</h1>
                                </div>
                                <div onClick={() => setActiveSection('events')} className={`dashboardNav-btn ${ activeSection === 'events' ? 'active' : ''}`}>
                                    <h1>Events</h1>
                                </div>
                            </div>
                        </div>

                        {activeSection === 'menu' && <MenuAdmin setModalCreateDish={setModalCreateDish} />}
                        {activeSection === 'orders' && <ManageOrders setModalCreateEmployee={setModalCreateEmployee} />}
                        {activeSection === 'users' && <ManageUsers setModalCreateEmployee={setModalCreateEmployee} />}
                        {activeSection === 'events' && <ManageEvents setModalCreateEvent={setModalCreateEvent} />}
                </div>

                <div className='dashboardContent-side'>
                    <div id='adminSidebar'>
                        <h1>Quick Actions</h1>
                        <div className='adminSidebar-btnContainer'>
                            <button onClick={() => setModalCreateDish()}>Add Dish</button>
                            <button onClick={() => setModalCreateEmployee()}>Add Employee</button>
                            <button onClick={() => setModalCreateEvent()}>Create Event</button>
                        </div>
                    </div>
                </div>

                {manageEventsModalIsOpen && <ManageEvents setEvents={setEvents} modalIsOpen={manageEventsModalIsOpen} setModalIsOpen={setManageEventsModalIsOpen} />}
            
            </div>
        </div>
    );
};

export default DashboardAdmin;
