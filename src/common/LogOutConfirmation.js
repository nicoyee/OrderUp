import './css/LogOutConfirmation.css';

import React, { useState, useEffect } from 'react';
import AuthController from '../class/controllers/AuthController';

const LogOutConfirmation = ({ closeModal }) => {

    const confirmSignOut = () => {
        AuthController.signOut();
        closeModal();
    };

    return (
        <div id='logOutConfirmation' className="modal">
            <div className='modal-header'>
                <span>
                    <h1>Log Out</h1>
                    <svg
                        onClick={ closeModal }
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="20"
                        height="20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                </span>
                <h2>Are you sure you want to log out?</h2>
            </div>
            <div className='modal-body'>
                <div className='modal-body-section'>
                    <button className='modalButton secondary' onClick={ confirmSignOut }>Yes</button>
                    <button className='modalButton primary' onClick={ closeModal }>No</button>
                </div>
            </div>

        </div>
    );
};

export default LogOutConfirmation;
