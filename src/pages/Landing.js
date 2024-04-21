import '../css/Landing.css';
import '../css/Modal.css';

import React, { useState, useEffect } from "react";
import { useMediaQuery } from 'react-responsive';
import Modal from 'react-modal';

import MarqueeVertical from '../components/Marquee-v';
import OrderNowButton from '../sections/OrderNowButton';
import ShareTab from '../components/ShareTab';
import Navigation from '../sections/Navigation';
import LogIn from '../auth/LogIn';
import SignUp from '../auth/SignUp';
import ForgotPassword from '../auth/ForgotPassword';

const sectionStyles = {
  home: { one: 'homeOne', two: 'homeTwo', /* ... */ },
  menu: { one: 'menuOne', two: 'menuTwo', /* ... */ },
  events: { one: 'eventsOne', two: 'eventsTwo', /* ... */ },
  concept: { one: 'conceptOne', two: 'conceptTwo', /* ... */ },
};

const LandingPage = () => {
  
  const [ activeSection, setActiveSection ] = useState("");
  const [ modal, showModal ] = useState(false);
  const [ modalContent, setModalContent ] = useState('login');

  const isDesktopOrLaptop = useMediaQuery({ query: '(min-width: 1023px)' });

  const styles = sectionStyles[activeSection] || {};

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

    <div className = "landing">

      <MarqueeVertical />
      <ShareTab />
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

      <div className = "content">

        <div className={`one ${styles.one}`}>
          { !isDesktopOrLaptop && <Navigation activeSection={ activeSection } setActiveSection={ setActiveSection }/> }
        </div>  
        <div className={`two ${styles.two}`}>
          { !isDesktopOrLaptop && activeSection === "" && <OrderNowButton openModal={openModal} /> }
        </div>
        <div className={`three ${styles.three}`}>

        </div>
        <div className={`four ${styles.four}`}>

        </div>
        <div className={`five ${styles.five}`}>
          { isDesktopOrLaptop && <Navigation activeSection={ activeSection } setActiveSection={ setActiveSection }/> }
        </div>
        <div className={`six ${styles.six}`}>

        </div>
        <div className={`seven ${styles.seven}`}>

        </div>
        <div className={`eight ${styles.eight}`}>
          { isDesktopOrLaptop && activeSection === "" && <OrderNowButton openModal={ openModal } /> }
        </div>
        <div className={`nine ${styles.nine}`}>

        </div>
      </div>
    </div>

  );
};

export default LandingPage;