import React, { useState } from 'react';
import '../css/CreateAccount.css'; 

function CreateAccountPage() {
  
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [location, setLocation] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');

   
    const handleSubmit = (e) => {
        e.preventDefault();

        
        if (password !== passwordConfirmation) {
            alert('Password and password confirmation do not match');
            return;
        }

       
        alert('Account created successfully');
        
       
        setFirstName('');
        setLastName('');
        setLocation('');
        setContactNumber('');
        setEmail('');
        setPassword('');
        setPasswordConfirmation('');
    };

    return (
        <div className="container">
            <header>CREATE ACCOUNT</header>
            <div className="create-account-form">
                <form onSubmit={handleSubmit}>
                    <label htmlFor="firstName">First Name:</label><br />
                    <input
                        type="text"
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        placeholder='Enter first name'
                    /><br />
                    <label htmlFor="lastName">Last Name:</label><br />
                    <input
                        type="text"
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        placeholder='Enter last name'
                    /><br />
                    <label htmlFor="location">Location:</label><br />
                    <input
                        type="text"
                        id="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder='Enter location'
                    /><br />
                    <label htmlFor="contactNumber">Contact Number:</label><br />
                    <input
                        type="text"
                        id="contactNumber"
                        value={contactNumber}
                        onChange={(e) => setContactNumber(e.target.value)}
                        placeholder='Enter contact number'
                    /><br />
                    <label htmlFor="email">Email:</label><br />
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder='Enter email'
                    /><br />
                    <label htmlFor="password">Password:</label><br />
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder='Enter password'
                    /><br />
                    <label htmlFor="passwordConfirmation">Confirm Password:</label><br />
                    <input
                        type="password"
                        id="passwordConfirmation"
                        value={passwordConfirmation}
                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                        required
                        placeholder='Confirm password'
                    /><br /><br />
                    <button type="submit">Create Account</button>
                </form>
            </div>
        </div>
    );
}

export default CreateAccountPage;
