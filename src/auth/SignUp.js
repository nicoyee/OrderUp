import '../common/css/Modal.css';
import './authForm.css';

import React, { useState } from 'react';
import Admin from '../class/admin/Admin';
import { userInstance } from '../class/User';
import { UserType } from '../constants';
import AuthController from '../class/controllers/AuthController';

const SignUp = ({ handleSignUp, closeModal, setLogin, isStaffSignUp }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordShown, setPasswordShown] = useState(false);
    const [signInError, setSignInError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');


    const togglePasswordVisibility = () => {
        setPasswordShown(!passwordShown);
    };

    const signUp = async (e) => {
        e.preventDefault();

        try {
            if (isStaffSignUp) {
                // Assuming you have access to the Admin class methods
                await Admin.signUpStaff(name, email, password, UserType.STAFF);
            } else {
                await AuthController.signUp(name, email, password, UserType.CUSTOMER);
            }
            // Handle successful sign-up (e.g., show a success message, close modal, etc.)
        } catch (error) {
            setSignInError(true);
            setErrorMessage(error.message || 'An error occurred during sign-up');
        }
    };

    return (
        <form id='authForm' className="modal" onSubmit={ signUp }>
            <div className='modal-header'>
                <span>
                    <h1>Sign Up</h1>
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
                <h2>Having an account ensures you get a streamlined experience. Don't worry, it's free!</h2>
            </div>
            <div className='authForm-body'>
                <div className='authForm-section'>
                    <label>Display Name</label>
                    <div className='authForm-input'>
                        <input type="text" placeholder="Enter your Name" value = { name } onChange={(e)=>setName(e.target.value)}/>
                    </div>
                </div>
                <div className='authForm-section'>
                    <label>Email</label>
                    <div className='authForm-input'>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>email-outline</title><path d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6M20 6L12 11L4 6H20M20 18H4V8L12 13L20 8V18Z" /></svg>
                        <input type="email" placeholder="Enter your Email" value = { email } onChange={(e)=>setEmail(e.target.value)}/>
                    </div>
                </div>
                <div className='authForm-section'>
                    <label>Password</label>
                    <div className='authForm-input'>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>form-textbox-password</title><path d="M17,7H22V17H17V19A1,1 0 0,0 18,20H20V22H17.5C16.95,22 16,21.55 16,21C16,21.55 15.05,22 14.5,22H12V20H14A1,1 0 0,0 15,19V5A1,1 0 0,0 14,4H12V2H14.5C15.05,2 16,2.45 16,3C16,2.45 16.95,2 17.5,2H20V4H18A1,1 0 0,0 17,5V7M2,7H13V9H4V15H13V17H2V7M20,15V9H17V15H20M8.5,12A1.5,1.5 0 0,0 7,10.5A1.5,1.5 0 0,0 5.5,12A1.5,1.5 0 0,0 7,13.5A1.5,1.5 0 0,0 8.5,12M13,10.89C12.39,10.33 11.44,10.38 10.88,11C10.32,11.6 10.37,12.55 11,13.11C11.55,13.63 12.43,13.63 13,13.11V10.89Z" /></svg>
                        <input type={ passwordShown ? 'text' : 'password' } placeholder="Enter your Password" value = { password } onChange={(e)=>setPassword(e.target.value)} />
                        <span onClick={ togglePasswordVisibility } className='passwordVisibility'>
                            { passwordShown ? 
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>Hide Password</title><path d="M11.83,9L15,12.16C15,12.11 15,12.05 15,12A3,3 0 0,0 12,9C11.94,9 11.89,9 11.83,9M7.53,9.8L9.08,11.35C9.03,11.56 9,11.77 9,12A3,3 0 0,0 12,15C12.22,15 12.44,14.97 12.65,14.92L14.2,16.47C13.53,16.8 12.79,17 12,17A5,5 0 0,1 7,12C7,11.21 7.2,10.47 7.53,9.8M2,4.27L4.28,6.55L4.73,7C3.08,8.3 1.78,10 1,12C2.73,16.39 7,19.5 12,19.5C13.55,19.5 15.03,19.2 16.38,18.66L16.81,19.08L19.73,22L21,20.73L3.27,3M12,7A5,5 0 0,1 17,12C17,12.64 16.87,13.26 16.64,13.82L19.57,16.75C21.07,15.5 22.27,13.86 23,12C21.27,7.61 17,4.5 12,4.5C10.6,4.5 9.26,4.75 8,5.2L10.17,7.35C10.74,7.13 11.35,7 12,7Z" /></svg>  
                            :
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>Show Password</title><path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z" /></svg>
                            }
                        </span>
                    </div>

                    {signInError && (
                        <div className='error-message'>
                            {errorMessage}
                        </div>
                    )}
                </div>
                <button className="authForm-submit">Sign Up</button>
                <p className='authRedirect-context'>Already have an account? <span className='authRedirect-link' onClick={ setLogin }>Log In</span></p>
            </div>
        </form>
    );
};

export default SignUp;
