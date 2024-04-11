import '../css/Sign.css';

import React, { useState } from 'react';
import { auth } from "../firebase.js"
import { sendPasswordResetEmail } from "firebase/auth";

const ForgotPassword = ({ closeModal }) => {

    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const forgotPassword = (e) => {

        e.preventDefault();
        e.stopPropagation();

        sendPasswordResetEmail(auth, email).then((userCredential) => {
        
            // const user = userCredential.user;
            console.log(userCredential);
        })

        .catch((error) => {

        const errorCode = error.code;
        setErrorMessage(error.message);

        console.log(error);

        });

    }

    return (

        < form className="form" onSubmit={ forgotPassword } >

            <div className = "title">
                <h1>Forgot Password</h1>
                
                <button onClick = { closeModal } >
                    <svg
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
                </button>
            </div>
            <div className="flex-column">           
                <label>Email </label>        
            </div>

            <div className="inputForm">
                <svg height="20" viewBox="0 0 32 32" width="20" xmlns="http://www.w3.org/2000/svg"><g id="Layer_3" data-name="Layer 3"><path d="m30.853 13.87a15 15 0 0 0 -29.729 4.082 15.1 15.1 0 0 0 12.876 12.918 15.6 15.6 0 0 0 2.016.13 14.85 14.85 0 0 0 7.715-2.145 1 1 0 1 0 -1.031-1.711 13.007 13.007 0 1 1 5.458-6.529 2.149 2.149 0 0 1 -4.158-.759v-10.856a1 1 0 0 0 -2 0v1.726a8 8 0 1 0 .2 10.325 4.135 4.135 0 0 0 7.83.274 15.2 15.2 0 0 0 .823-7.455zm-14.853 8.13a6 6 0 1 1 6-6 6.006 6.006 0 0 1 -6 6z"></path></g></svg>
                
                <input type="email" className="input" placeholder="Enter your Email" value = { email } onChange={(e)=>setEmail(e.target.value)} />
            
            </div>

            { errorMessage && <p className="errormsg">{ errorMessage }</p>}
            
            <button type="submit" name="submit" className="button-submit">Reset Password</button>
            
            <p className="p">

                Remember your password?

                <span className="span">Login here</span>

            </p>

            <p className="p line">Or</p>

            <div className="flex-row">
                <button className="btn google">

                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                    <path fill="none" d="M0 0h48v48H0z"></path>
                </svg>

                Sign In with Google 

                </button>
            </div>

        </form>

    );
}
export default ForgotPassword;