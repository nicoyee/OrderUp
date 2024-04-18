import '../css/Sign.css';

import React, { useState } from 'react';
import { auth } from "../firebase.js"
import { sendPasswordResetEmail } from "firebase/auth";


const ForgotPassword = ({ closeModal, setLogin }) => {
    
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [emailSent, setEmailSent] = useState(false);

    const resetPassword = (e) => {
        e.preventDefault();

        {/* 
        const actionCodeSettings = {
            url: 'https://www.example.com/?email=' + email,
            // When the link is opened on an iOS device, go to 'com.example.ios'.
            iOS: {
                bundleId: 'com.example.ios'
            },
            // When the link is opened on an Android device, go to 'com.example.android'.
            android: {
                packageName: 'com.example.android',
                installApp: true,
                minimumVersion: '12'
            },
            handleCodeInApp: true
        };
        */}

        sendPasswordResetEmail(auth, email)
            .then(() => {
                setEmailSent(true);
                console.log('Password reset email sent!');
            })
            .catch ((error) =>  {
                setErrorMessage('An error has occured');
                console.log(error);
            })
    }

    return (

        < form className="form" onSubmit= { resetPassword } >

            <div className = "forgotPass header">
                <h1>Forgot Your Password?</h1>
                <svg
                    onClick = { closeModal }
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

            { emailSent ?
                <h2>We've sent a password reset link to your email. Please check your inbox </h2>
            :
                <h2>We'll send you a password reset link using your email</h2>
            }

            <div className="flex-column">           
                <label>Email</label>        
            </div>

            <div className="inputForm">
                <svg height="20" viewBox="0 0 32 32" width="20" xmlns="http://www.w3.org/2000/svg"><g id="Layer_3" data-name="Layer 3"><path d="m30.853 13.87a15 15 0 0 0 -29.729 4.082 15.1 15.1 0 0 0 12.876 12.918 15.6 15.6 0 0 0 2.016.13 14.85 14.85 0 0 0 7.715-2.145 1 1 0 1 0 -1.031-1.711 13.007 13.007 0 1 1 5.458-6.529 2.149 2.149 0 0 1 -4.158-.759v-10.856a1 1 0 0 0 -2 0v1.726a8 8 0 1 0 .2 10.325 4.135 4.135 0 0 0 7.83.274 15.2 15.2 0 0 0 .823-7.455zm-14.853 8.13a6 6 0 1 1 6-6 6.006 6.006 0 0 1 -6 6z"></path></g></svg>
                <input type="email" className="input" placeholder="Enter your Email" value = { email } onChange={(e)=>setEmail(e.target.value)} />   
            </div>

            { errorMessage && <p className="errormsg">{ errorMessage }</p>}
            

            { emailSent ? 
                <button className="email-sent" disabled = { true }>Email Sent</button>    
            :  
                <button type="submit" name="submit" className="button-submit">Reset Password</button>
            }
            
            <p className="p">

                Already have have an account?

                <span className="span-redirect" onClick = { setLogin }>Log In</span>

            </p>

        </form>

    );
}
export default ForgotPassword;