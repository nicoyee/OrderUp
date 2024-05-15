import '../css/authForms.css';

import React, { useState } from 'react';
import {
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    InputGroup,
    Input,
    Stack,
    InputLeftAddon,
} from '@chakra-ui/react';
import { MdEmail } from "react-icons/md";

const ForgotPassword = ({ setAuthModal }) => {
    
    const [email, setEmail] = useState('');
    const [emailSent, setEmailSent] = useState(false);

    return (

        <ModalContent>

            <ModalHeader>
                <h1>Forgot Password</h1>
                { emailSent ?
                    <h2>We've sent a password reset link to your email. Please check your inbox </h2>
                    :
                    <h2>We'll send you a password reset link using your email</h2>
                }
            </ModalHeader>
            <ModalCloseButton />
            
            <form id='authForm'>

                <Stack spacing={1}>
                    <h3>Email</h3>
                    <InputGroup>
                        <InputLeftAddon pointerEvents='none' p='15px'>
                            <MdEmail />
                        </InputLeftAddon>
                        <Input type="email" placeholder='Enter email' value = { email } onChange={(e)=>setEmail(e.target.value)} />
                    </InputGroup>
                </Stack>

                <Stack mt={'20px'} textAlign={'center'} spacing={4}>

                    { emailSent ?
                        <button className="authButton authResetLinkSent" disabled = { true } >Email Sent</button>
                    :
                        <button type="submit" name="resetPass" className="authButton authSubmit">Reset Password</button>
                    }
    
                    <h4>Already have an account? <span className='authRedirect' onClick={() => setAuthModal('login')} >Log In</span></h4>
                </Stack>
            </form>

        </ModalContent>
    );
}
export default ForgotPassword;