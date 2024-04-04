import '../css/Dashboard.css';

import React, { useState } from 'react';
import ReactModal from 'react-modal';


import SignIn from '../components/SignIn';
import SignUp from '../components/SignUp';

const DashNeutral = () => {

  const [showModal, setShowModal] = useState(false);

  const openModal = () => {
    setShowModal(true);
    document.body.classList.add('modal-open');
  };

  const closeModal = () => {
    setShowModal(false);
    document.body.classList.remove('modal-open');
  };

  return (
    <section id = "home"> 

      <h1>There's no better way to</h1>
      <h2>Embrace flavors in a bowl</h2>

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

      <ReactModal isOpen={showModal} onRequestClose={closeModal} className="signinmodal" overlayClassName="signinoverlay">

        <SignUp closeModal={ closeModal } />

      </ReactModal>

    </section>

  );
};

export default DashNeutral;