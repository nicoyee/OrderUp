import './authForm.css';

import React, { useState, useEffect } from 'react';
import AuthController from '../class/controllers/AuthController';

const ForgotPassword = ({ closeModal, setLogin, currentEmail }) => {
    const [email, setEmail] = useState('');
    const [emailSent, setEmailSent] = useState(false);
    const [errorMessage, setErrorMessage] = useState(''); // New state for error message

    useEffect(() => {
        if (currentEmail) {
            setEmail(currentEmail);
        }
    }, [currentEmail]);

    const resetPassword = async (e) => {
        e.preventDefault();
        setErrorMessage(''); // Clear any previous errors

        try {
            await AuthController.resetPassword(email);
            console.log('yes');
            setEmailSent(true); // If successful, set emailSent to true
        } catch (error) {
            console.log('no');
            setErrorMessage('Email does not exist. Please try again.'); // Handle error
        }
    };

    

    return (
        <form id='authForm' className="modal" onSubmit={ resetPassword }>
            <div className='modal-header'>
                <span>
                    <h1>Reset Your Password</h1>
                    <svg
                        onClick={closeModal}
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
                {emailSent ? 
                    <h2>We've sent a password reset link to your email. Please check your inbox</h2> 
                    : 
                    <h2>We'll send you a password reset link using your email</h2>
                }
            </div>
            <div className='authForm-body'>
                <div className='authForm-section'>
                    <label>Email</label>
                    <div className='authForm-input'>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>email-outline</title><path d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6M20 6L12 11L4 6H20M20 18H4V8L12 13L20 8V18Z" /></svg>
                        <input 
                            type="email" 
                            placeholder="Enter your Email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                        />
                    </div>
                </div>

                {/* Display error message if it exists */}
                {errorMessage && (
                    <div className='error-message'>
                        {errorMessage}
                    </div>
                )}

                {emailSent ? 
                    <button className="authForm-submit emailSent" disabled={true}>Email Sent</button> 
                    : 
                    <button type="submit" name="submit" className="authForm-submit">Reset Password</button>
                }
                
                {setLogin && (
                    <p className='authRedirect-context'>
                        Already have an account? <span className='authRedirect-link' onClick={setLogin}>Log In</span>
                    </p>
                )}

                
            </div>
        </form>
    );
};

export default ForgotPassword;
