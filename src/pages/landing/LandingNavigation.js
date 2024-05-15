import '../../css/pages/landing/LandingNavigation.css';
import '../../css/pages/landing/LandingNavigation2.css';
import events from "../../assets/events.svg";

import React, { useState, useRef } from "react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure
} from '@chakra-ui/react';

import LogIn from '../../auth/LogIn';
import SignUp from '../../auth/SignUp';
import ForgotPassword from '../../auth/ForgotPassword';
import MenuButton from '../../components/MenuButton';
import EventsButton from '../../components/EventsButton';

const LandingNavigation = () => {
  
    const [alignment, setAlignment] = useState('center');
    const [authModal, setAuthModal] = useState('login');
    const { isOpen: authModalIsOpen, onOpen: openAuthModal, onClose: closeAuthModal } = useDisclosure();

    return (
            <div id='landingNavigation'>
                <div className='landingNavigation-left'>

                    <MenuButton setAlignment={ setAlignment } />
                    
                </div>
                <div className='landingNavigation-center'>
                    <div className={`landingNavigation-title navTitle-${alignment}`}>
                        <p>Embrace</p>
                        <p>Flavors In</p>
                        <p>a Bowl</p>
                    </div>

                    <button onClick={ openAuthModal }>
                        Order Now
                        <div id='orderNowSubtitle'> 
                            <h2><span>//</span> Login</h2> <h2><span>//</span> Order</h2> 
                        </div> 
                    </button>

                    <Modal
                        isCentered
                        isOpen={ authModalIsOpen } 
                        onClose={ closeAuthModal }
                        variant='auth'
                    >
                        <ModalOverlay backdropFilter='blur(5px) hue-rotate(90deg)' />
                        
                        { authModal === "login" && (<LogIn setAuthModal={ setAuthModal } />) }
                        { authModal === "signup" && (<SignUp setAuthModal={ setAuthModal } />) }
                        { authModal === "forgotpassword" && (<ForgotPassword setAuthModal={ setAuthModal } />) }
                        
                    </Modal>

                </div>
                <div className='landingNavigation-right'>
                    
                    <EventsButton setAlignment={ setAlignment } />

                </div>
            </div>
    );
};

export default LandingNavigation;