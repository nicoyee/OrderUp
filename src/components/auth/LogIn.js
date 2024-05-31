import './authForms.css';
import {
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    InputGroup,
    Input,
    Stack,
    InputRightElement,
    InputLeftAddon,
    IconButton,
} from '@chakra-ui/react';
import { MdEmail, MdPassword } from "react-icons/md";
import { VscEye, VscEyeClosed  } from "react-icons/vsc";

import React, { useState } from 'react';
import {  } from '@chakra-ui/react';
import AuthController from '../class/auth/AuthController';

const LogIn = ({ setAuthModal }) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordShown, setPasswordShown] = useState(false);

    const signIn = (e) => {
        e.preventDefault();
        AuthController.logIn(email, password);
    }

    return (

        <ModalContent>

            <ModalHeader>
                <h1>Log In</h1>
                <h2>Get the most out of our services by signing in.</h2>
            </ModalHeader>
            <ModalCloseButton />
            
            <form id='authForm' onSubmit={ signIn }>

                <Stack spacing={1}>
                    <h3>Email</h3>
                    <InputGroup>
                        <InputLeftAddon pointerEvents='none' p='15px'>
                            <MdEmail />
                        </InputLeftAddon>
                        <Input type="email" placeholder='Enter email' value = { email } onChange={(e)=>setEmail(e.target.value)} />
                    </InputGroup>
                </Stack>

                <Stack spacing={1}>
                    <h3>Password</h3>
                    <InputGroup>
                        <InputLeftAddon pointerEvents='none' p='15px'>
                            <MdPassword />
                        </InputLeftAddon>
 
                        <Input type={ passwordShown ? 'text' : 'password' } placeholder='Enter password' value = { password } onChange={(e)=>setPassword(e.target.value)} />

                        <InputRightElement>
                            { passwordShown ? <IconButton icon={<VscEye />} onClick={ () => setPasswordShown(false) } bg={'transparent'} /> : <IconButton icon={<VscEyeClosed />} onClick={ () => setPasswordShown(true) } bg={'transparent'} /> } 
                        </InputRightElement>
                        
                    </InputGroup>
                    <span id='forgotPassRedirect' className='authRedirect' onClick={() => setAuthModal('forgotpassword')}>Forgot Password?</span>
                </Stack>

                <Stack mt={'20px'} textAlign={'center'} spacing={4}>
                    <button type="submit" name="submit" className="authButton authSubmit">Log In</button>
                    <h4>Don't have an account? <span className='authRedirect' onClick={() => setAuthModal('signup')} >Sign Up</span></h4>
                </Stack>

                <Stack textAlign={'center'} fontSize={'14px'}>
                    <h5>Or</h5>
                </Stack>

                <Stack>
                    <button className='authButton authGoogleSignIn'>
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                            <path fill="none" d="M0 0h48v48H0z"></path>
                        </svg>
                        Sign In with Google 
                    </button>
                </Stack>

            </form>

        </ModalContent>
    );
}
export default LogIn;