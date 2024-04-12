import '../css/Sign.css';

import React, { useState } from 'react';
import { auth, db } from "../firebase.js"
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

const LogIn = ({ closeModal, setSignup, setForgot }) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [passwordShown, setPasswordShown] = useState(false);

    const googleAuth = new GoogleAuthProvider();

    const togglePasswordVisiblity = () => {
    setPasswordShown(passwordShown ? false : true);
    };

    const signInGoogle = async (e) => {

        e.preventDefault();
        e.stopPropagation();

        try {
            const userCredential = await signInWithPopup(auth, googleAuth);
            const user = userCredential.user;

            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                const nameParts = user.displayName.split(' ');
                const firstName = nameParts[0];
                await setDoc(doc(db, "users", user.uid), {
                    name: firstName,
                    email: user.email,
                    userType: "customer",
                    profilePicture: user.photoURL
                });
                console.log("User successfully created");
            }
            console.log("User successfully signed in");
        } catch (error) {
            setErrorMessage("An Error has occured");
            console.log(error);
        }
    }

    const signIn = (e) => {

        e.preventDefault();
        e.stopPropagation();

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log("User Successfully Logged In!");
                setErrorMessage('');
            })
            .catch((error) => {
                let errorMessage;
                switch (error.code) {
                    case 'auth/too-many-requests':
                        errorMessage = 'Too many requests. Please try again later';
                        break;
                    case 'auth/wrong-password':
                        errorMessage = 'Invalid Password';
                        break;
                    case 'auth/user-not-found':
                        errorMessage = 'User not found';
                        break;
                    case 'auth/network-request-failed':
                        errorMessage = 'No Internet Connection';
                        break;
                    default:
                        errorMessage = "Invalid Credentials";
                }
                setErrorMessage(errorMessage);
                console.error(error.code);
            }); 

    }

    return (

        < form className="form" onSubmit={ signIn } >

            <div className = "header">
                <h1>Log In</h1>
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

            <h2>Get the most out of our services by signing in</h2>

            <div className="flex-column">           
                <label>Email</label>        
            </div>

            <div className="inputForm">
                <svg height="20" viewBox="0 0 32 32" width="20" xmlns="http://www.w3.org/2000/svg"><g id="Layer_3" data-name="Layer 3"><path d="m30.853 13.87a15 15 0 0 0 -29.729 4.082 15.1 15.1 0 0 0 12.876 12.918 15.6 15.6 0 0 0 2.016.13 14.85 14.85 0 0 0 7.715-2.145 1 1 0 1 0 -1.031-1.711 13.007 13.007 0 1 1 5.458-6.529 2.149 2.149 0 0 1 -4.158-.759v-10.856a1 1 0 0 0 -2 0v1.726a8 8 0 1 0 .2 10.325 4.135 4.135 0 0 0 7.83.274 15.2 15.2 0 0 0 .823-7.455zm-14.853 8.13a6 6 0 1 1 6-6 6.006 6.006 0 0 1 -6 6z"></path></g></svg>
                <input type="email" className="input" placeholder="Enter your Email" value = { email } onChange={(e)=>setEmail(e.target.value)} />   
            </div>

            <div className="flex-column">
                <label>Password </label>
            </div>

            <div className="inputForm">
                <svg height="20" viewBox="-64 0 512 512" width="20" xmlns="http://www.w3.org/2000/svg"><path d="m336 512h-288c-26.453125 0-48-21.523438-48-48v-224c0-26.476562 21.546875-48 48-48h288c26.453125 0 48 21.523438 48 48v224c0 26.476562-21.546875 48-48 48zm-288-288c-8.8125 0-16 7.167969-16 16v224c0 8.832031 7.1875 16 16 16h288c8.8125 0 16-7.167969 16-16v-224c0-8.832031-7.1875-16-16-16zm0 0"></path><path d="m304 224c-8.832031 0-16-7.167969-16-16v-80c0-52.929688-43.070312-96-96-96s-96 43.070312-96 96v80c0 8.832031-7.167969 16-16 16s-16-7.167969-16-16v-80c0-70.59375 57.40625-128 128-128s128 57.40625 128 128v80c0 8.832031-7.167969 16-16 16zm0 0"></path></svg>        
                <input type={passwordShown ? "text" : "password"} className="input" placeholder="Enter your Password" value = { password } onChange={(e)=>setPassword(e.target.value)} />

                { passwordShown ? 
                    <button type="button" onClick = { togglePasswordVisiblity }> 
                        <span className = "material-symbols-outlined">
                            visibility
                        </span> 
                    </button>

                    :

                    <button type="button" onClick = { togglePasswordVisiblity }>
                        <span className = "material-symbols-outlined">
                            visibility_off
                        </span> 
                    </button>   
                }
                
            </div>
    
            <div className="flex-row">
                {
                /*         
                 <div>
                    <input type="checkbox" />
                    <label> Remember me </label>
                </div>       
                */
                }
                <span className="span-redirect" onClick = { setForgot }>Forgot password?</span>
            </div>

            { errorMessage && <p className="errormsg">{ errorMessage }</p>}
            
            <button type="submit" name="submit" className="button-submit">Log In</button>
            
            <p className="p">

                Don't have an account?

                <span className="span-redirect" onClick = { setSignup }>Sign Up</span>

            </p>

            <p className="p line">Or</p>

            <div className="flex-row">
                <button className="btn google" onClick = { signInGoogle }>

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
export default LogIn;