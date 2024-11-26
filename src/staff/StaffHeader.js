import "../common/css/Header.css";

import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from 'react-modal';

import LogOutConfirmation from '../common/LogOutConfirmation.js';

const StaffHeader = () => {

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

    return (
        <div className="header staff">
            <div className="header-wrapper">
                <div className="header-left">
                    <h1 className="siteLogo admin" onClick={() => navigate("/dashboard")}>RiceBoy</h1>
                </div>
                <div className="header-right">
                    <a onClick={ openModal }>Log Out</a>
                </div>
            </div>

            <Modal
                isOpen={ modal }
                onRequestClose={ closeModal }
                className={`${ modal ? 'modal-open' : '' }`}
                overlayClassName="modalOverlay"
            >
                <LogOutConfirmation closeModal={ closeModal } />
            </Modal>

        </div>
    );
}

export default StaffHeader;