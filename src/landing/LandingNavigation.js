import './css/LandingNavigation.css';
import './css/LandingNavigation2.css';

import React, { useState } from "react";
import Modal from 'react-modal';

import MenuButton from './MenuButton';
import EventsButton from './EventsButton';
import LogIn from '../auth/LogIn';
import SignUp from '../auth/SignUp';
import ForgotPassword from '../auth/ForgotPassword';

const LandingNavigation = ({ setLandingContent }) => {
  
    const [alignment, setAlignment] = useState('center');
    const [ activeSection, setActiveSection ] = useState("");
    const [ modal, showModal ] = useState(false);
    const [ modalContent, setModalContent ] = useState('login');

    const openModal = () => {
        showModal(true);
        document.body.classList.add('modal-open');
    };

    const closeModal = () => {
        showModal(false);
        setModalContent('login');
        document.body.classList.remove('modal-open');
    };

    const setLogin = () => {
        setModalContent('login');
    };

    const setSignup = () => {
        setModalContent('signup');
    };

    const setForgot = () => {
        setModalContent('forgotpass');
    };

    return (
        <div id='landingNavigation'>

            <Modal
                isOpen={ modal }
                onRequestClose={ closeModal }
                className={`authModal ${ modal ? 'modal-open' : '' }`}
                overlayClassName="modalOverlay"
            >

                { modalContent === "login" && ( <LogIn closeModal={ closeModal } setSignup = { setSignup } setForgot = { setForgot } /> )}
                { modalContent === "signup" && ( <SignUp closeModal={ closeModal } setLogin = { setLogin } /> )}
                { modalContent === "forgotpass" && ( <ForgotPassword closeModal={ closeModal } setLogin = { setLogin } /> )}

            </Modal>

            <div className='landingNavigation-left'>

                <MenuButton 
                    setAlignment={ setAlignment } 
                    setLandingContent={ setLandingContent }
                />

            </div>

            <div className='landingNavigation-center'>
                    <div className={`landingNavigation-title navTitle-${alignment}`}>
                        <p>Embrace</p>
                        <p>Flavors In</p>
                        <p>a Bowl</p>
                    </div>

                    <button id='orderNowButton' onClick={ openModal }>
                        Order Now
                        <div id='orderNowSubtitle'> 
                            <h2><span>//</span> Login</h2> <h2><span>//</span> Order</h2> 
                        </div> 
                    </button>

            </div>

            <div className='landingNavigation-right'>
                    
                <EventsButton setAlignment={ setAlignment } />

            </div>

        </div>
    );
};

export default LandingNavigation;