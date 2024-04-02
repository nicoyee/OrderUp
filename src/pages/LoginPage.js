import React, { useState } from 'react';
import '../css/LoginPage.css';

function LoginPage() {
    // State variables to store username and password
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isCreatingAccount, setIsCreatingAccount] = useState(false);

    // Function to handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        if (isCreatingAccount) {
            // Placeholder for account creation logic
            // Here, you can add code to create a new account with the provided username and password
            alert('Account created successfully');
            setIsCreatingAccount(false); // Resetting the flag after account creation
        } else {
            // Placeholder for actual authentication logic
            // For demonstration purposes, let's assume username is "admin" and password is "password"
            if (username === 'admin' && password === 'password') {
                alert('Login successful');
                // Redirect to a new page or perform any other action upon successful login
                // For example, history.push('/dashboard');
            } else {
                alert('Invalid username or password');
            }
        }
    };

    return (
        <div className="container">
            <header>{isCreatingAccount ? 'CREATE ACCOUNT' : 'LOGIN'}</header>
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