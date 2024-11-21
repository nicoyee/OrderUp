import "./css/CustomerProfile.css";

import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Modal from 'react-modal';

import { UserContext } from "../App";

import Header from "./CustomerHeader";
import Orders from './CustomerProfileOrders';
import Balance from './CustomerProfileBalance';
import ResetPassword from '../auth/ForgotPassword';

const CustomerProfile = () => {
  const user = useContext(UserContext);
  const navigate = useNavigate();

  const [ modal, showModal ] = useState(false);

  const openModal = () => {
    showModal(true);
    document.body.classList.add('modal-open');
  };

  const closeModal = () => {
    showModal(false);
    document.body.classList.remove('modal-open');
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboardContainer">

      <Header />
      
      <div id="customerProfile">

        <div className="customerProfile-container">

          <div className="customerProfile-container-section">

            <div className="userInfo customer">
              <div className="userInfo-left">
                <span className="vertical">
                  <h1>Welcome Back</h1>
                  <h2>{user.name}</h2>
                  <h3>{user.email}</h3>
                </span>
                <button className='primaryButton' onClick={ openModal }>Reset Password</button>
              </div>
            </div>
            
            <Balance />
                  
          </div>

          <Orders />

        </div>

      </div>

      <Modal
        isOpen={ modal }
        onRequestClose={ closeModal }
        className={`authModal ${ modal ? 'modal-open' : '' }`}
        overlayClassName="modalOverlay"
      >
        <ResetPassword 
          closeModal={ closeModal }
          currentEmail={ user.email }
        />
      </Modal>
    </div>
  );
};

export default CustomerProfile;