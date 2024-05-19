import '../css/authForms.css';
import React, { useState } from 'react';
import AuthService from '../class/AuthService';

const SignUp = ({ handleSignUp, closeModal, setLogin, userType, isStaffSignUp }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [passwordShown, setPasswordShown] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordShown(!passwordShown);
    };

    const signUp = async (e) => {
        e.preventDefault();
        try {
            await handleSignUp(name, email, password, userType);
        } catch (error) {
            setErrorMessage('Error signing up. Please try again.');
        }
    };

    return (
        <form className="form" onSubmit={signUp}>
            <div className="header">
                <h1>{isStaffSignUp ? "Sign Up a Staff" : "Sign Up"}</h1>
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
            </div>

            <h3>{isStaffSignUp ? "" : "Having an account ensures you get a streamlined experience. Don't worry, it's free!"}</h3>

            <div className="flex-column">
                <label>Display Name</label>
            </div>

            <div className="inputForm">
                <input type="text" className="authInput" placeholder="Enter your Name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div className="flex-column">
                <label>Email</label>
            </div>

            <div className="inputForm">
                <svg height="20" viewBox="0 0 32 32" width="20" xmlns="http://www.w3.org/2000/svg">
                    <g id="Layer_3" data-name="Layer 3">
                        <path d="m30.853 13.87a15 15 0 0 0 -29.729 4.082 15.1 15.1 0 0 0 12.876 12.918 15.6 15.6 0 0 0 2.016.13 14.85 14.85 0 0 0 7.715-2.145 1 1 0 1 0 -1.031-1.711 13.007 13.007 0 1 1 5.458-6.529 2.149 2.149 0 0 1 -4.158-.759v-10.856a1 1 0 0 0 -2 0v1.726a8 8 0 1 0 .2 10.325 4.135 4.135 0 0 0 7.83.274 15.2 15.2 0 0 0 .823-7.455zm-14.853 8.13a6 6 0 1 1 6-6 6.006 6.006 0 0 1 -6 6z"></path>
                    </g>
                </svg>
                <input type="email" className="authInput" placeholder="Enter your Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div className="flex-column">
                <label>Password</label>
            </div>

            <div className="inputForm">
                <svg height="20" viewBox="-64 0 512 512" width="20" xmlns="http://www.w3.org/2000/svg">
                    <path d="m336 512h-288c-26.453125 0-48-21.523438-48-48v-224c0-26.476562 21.546875-48 48-48h288c26.453125 0 48 21.523438 48 48v224c0 26.476562-21.546875 48-48 48zm-288-288c-8.8125 0-16 7.167969-16 16v224c0 8.832031 7.1875 16 16 16h288c8.8125 0 16-7.167969 16-16v-224c0-8.832031-7.1875-16-16-16zm0 0"></path>
                    <path d="m304 224c-8.832031 0-16-7.167969-16-16v-80c0-52.929688-43.070312-96-96-96s-96 43.070312-96 96v80c0 8.832031-7.167969 16-16 16s-16-7.167969-16-16v-80c0-70.59375 57.40625-128 128-128s128 57.40625 128 128v80c0 8.832031-7.167969 16-16 16zm0 0"></path>
                </svg>
                <input type={passwordShown ? "text" : "password"} className="authInput" placeholder="Enter your Password" value={password} onChange={(e) => setPassword(e.target.value)} />

                <button type="button" onClick={togglePasswordVisibility}>
                    <span className="material-symbols-outlined">
                        {passwordShown ? 'visibility' : 'visibility_off'}
                    </span>
                </button>
            </div>

            <p className="disclaimer">
                By signing up, you agree to the site's
                <span className="span-redirect">Terms and Conditions</span>
            </p>

            {errorMessage && <p className="errormsg">{errorMessage}</p>}

            <button type="submit" name="submit" className="button-submit">Sign Up</button>

            {!isStaffSignUp && (
                <p className="p">
                    Already have an account?
                    <span className="span-redirect" onClick={setLogin}>Log In</span>
                </p>
            )}
        </form>
    );
};

export default SignUp;
