import React, { useState } from 'react';
import '../css/LoginPage.css';

function LoginPage() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isCreatingAccount, setIsCreatingAccount] = useState(false);


    const handleSubmit = (e) => {
        e.preventDefault();

        if (isCreatingAccount) {
         
            alert('Account created successfully');
            setIsCreatingAccount(false); 
        } else {
           
            if (username === 'admin' && password === 'password') {
                alert('Login successful');
              
            } else {
                alert('Invalid username or password');
            }
        }
    };

    return (
        <div className="container">
            <header>Login</header>
            <div className="login-form">
                <form onSubmit={handleSubmit}>
                    <label htmlFor="username">Username:</label><br />
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        placeholder='Enter username'
                    /><br />
                    <label htmlFor="password">Password:</label><br />
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder='Enter password'
                    /><br /><br />
                    <button type="submit">{isCreatingAccount ? 'Create Account' : 'Login'}</button>
                </form>
                <button className="create-account-button" onClick={() => setIsCreatingAccount(!isCreatingAccount)}>
            {isCreatingAccount ? 'Back to Login' : 'Create Account'}
            </button>
            </div>
        </div>
    );
}

export default LoginPage;