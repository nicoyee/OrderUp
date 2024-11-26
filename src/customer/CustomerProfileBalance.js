import "./css/CustomerProfileBalance.css";
import "../common/css/Data.css";

import { FaCoins } from "react-icons/fa6";

import React, { useContext, useState, useEffect } from "react";
import { toast, Flip } from 'react-toastify';
import Modal from 'react-modal';

import { UserContext } from "../App";
import OrderController from "../class/controllers/OrderController"; 
import PaymentController from "../class/controllers/PaymentController";
import StatusIndicator from "../common/UserStatusIndicator";


const CustomerProfileBalance = () => {

    const user = useContext(UserContext);
    const [ balanceTransactions, setBalanceTransactions ] = useState([]);
    const [ errorMessage, setErrorMessage ] = useState("");

    useEffect(() => {
        const checkRemainingBalance = async () => {
            const userEmail = user.email;
            try {
    
              const transactions = await OrderController.fetchTransactions(userEmail);
              setBalanceTransactions(transactions);
        
            } catch (error) {
    
                console.error("Error fetching balance:", error);
                toast.error(`An error occurred while fetching the balance.`, {
                    position: "bottom-center",
                    autoClose: 2000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    transition: Flip,
                });
            }
        };
        checkRemainingBalance();   
    }, [user]);

    const handlePay = async (transactionId) => {
        try {
            const userEmail = user.email; 
            const transactions = await OrderController.fetchTransactions(userEmail);
            const transactionToPay = transactions.find(t => t.id === transactionId);
            
            if (!transactionToPay) {
                console.error("Transaction not found for ID:", transactionId); 
                throw new Error("Transaction not found.");
            }
        
            if (transactionToPay.status === "paid") {
                throw new Error("This transaction is already paid.");
            }
        
            const amountInCents = transactionToPay.remainingBalance;
            const description = `Payment for Remaining Balance ID: ${transactionId}`;
            const paymentLink = await PaymentController.createPaymentLink(amountInCents, description, null);
        
            window.location.href = paymentLink;
        } catch (error) {
            console.error("Error processing payment:", error.message || error);
            toast.error(`Error processing payment. Please try again.`, {
                position: "bottom-center",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Flip,
            });
        }
    };

    const formatDate = (timestamp) => {
        if (timestamp && timestamp.seconds) {
          const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp.seconds * 1000);
          return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          });
        }
        return 'N/A';
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div id='customerProfileBalance' className="dataCard table">

            <div className="dataCard-header">
              <span className="cardTitleIcon">
                <FaCoins />
                <h1>Remaining Balance</h1>
              </span>    
            </div>

            {balanceTransactions.length === 0 ? (
                <div className="dataCard-content info">
                    <p>No balance found for this user</p>
                </div>
            ) : (
                <div className="dataCard-content full">
                    <table>
                        <thead>
                            <tr>
                                <th>Ref#</th>
                                <th>Status</th>
                                <th>Balance</th>
                                <th>Date</th>                               
                            </tr>
                        </thead>

                        <tbody>
                            {balanceTransactions.map((transaction) => (
                                <tr key={transaction.id} onClick={() =>handlePay(transaction.id)}>
                                    <td className='refNum'>{transaction.id}</td>
                                    <td><StatusIndicator status={transaction.status} /></td>
                                    <td>₱{transaction.remainingBalance}</td>
                                    <td className='transactionDate'>{formatDate(transaction.createdDate)}</td>       
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>     
            )}

            <div className="dataCard-footer">

            </div>

        </div>
    );
    
};

export default CustomerProfileBalance;