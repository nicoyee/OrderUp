import './authForms.css';

import React, { useState } from 'react';
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

const SignUp = ({ setAuthModal }) => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordShown, setPasswordShown] = useState(false);

    return (
        <ModalContent>

            <ModalHeader>
                <h1>Sign Up</h1>
                <h2>Get the most out of our services by signing in.</h2>
            </ModalHeader>
            <ModalCloseButton />
            
            <form id='authForm'>
                <Stack spacing={1}>
                    <h3>Display Name</h3>
                    <InputGroup>
                        <Input type="text" placeholder='Enter name' value = { name } onChange={(e)=>setName(e.target.value)} />
                    </InputGroup>
                </Stack>
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
                </Stack>
                <Stack mt={'20px'} textAlign={'center'} spacing={4}>
                    <button type="submit" name="submit" className="authButton authSubmit">Sign Up</button>
                    <h4>Already have an account? <span className='authRedirect' onClick={() => setAuthModal('login')} >Log In</span></h4>
                </Stack>
            </form>

        </ModalContent>
    );
}
export default SignUp;