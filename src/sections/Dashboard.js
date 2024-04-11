import '../css/Dashboard.css';

import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

import LogIn from '../components/LogIn';
import SignUp from '../components/SignUp';
import ForgotPassword from '../components/ForgotPassword';

const headerOptions = ['flavors', 'happiness', 'delights', 'awesomeness'];
const headerColors = ['#f5a53f', '#39c0f9', '#fcf2f4', '#e84a2c', '#caceca'];

const DashNeutral = () => {

  const [index, setIndex] = useState(0);
  const [color, setColor] = useState('#f05006');

  useEffect(() => {

    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % headerOptions.length);
      setColor(headerOptions[(index + 1) % headerOptions.length] === 'flavors' ? '#f05006' : headerColors[(index + 1) % headerColors.length]);
    }, 1500);

    return () => clearInterval(interval);

  }, [index]);

  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState("login");

  const openModal = () => {
    setShowModal(true);
    document.body.classList.add('modal-open');
  };

  const closeModal = () => {
    setShowModal(false);
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
    <section id = "home"> 

      <h1>There's no better way to</h1>
      <h2>Embrace</h2>
      <h2 className = "alternating" style={{color: color}}>{headerOptions[index]}</h2>
      <h2>in a bowl</h2>

      <button className="order-now" onClick={ openModal }>
        <span className="hover-underline-animation"> Order Now </span>
          <svg
            id="arrow-horizontal"
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="10"
            viewBox="0 0 46 16"
          >
            <path
            id="Path_10"
            data-name="Path 10"
            d="M8,0,6.545,1.455l5.506,5.506H-30V9.039H12.052L6.545,14.545,8,16l8-8Z"
            transform="translate(30)"
            ></path>
          </svg>
      </button>

      <Modal 
        isOpen = { showModal } 
        onRequestClose = { closeModal }
        className = "signinmodal"
        overlayClassName="signinoverlay"
      >

      { modalContent === "login" && ( <LogIn closeModal={ closeModal } setSignup = { setSignup } setForgot = { setForgot } /> )}
      { modalContent === "signup" && ( <SignUp closeModal={ closeModal } setLogin = { setLogin } /> )}
      { modalContent === "forgotpass" && ( <ForgotPassword closeModal={ closeModal } setLogin = { setLogin } /> )}
        

      </Modal>

    </section>

  );
};

export default DashNeutral;