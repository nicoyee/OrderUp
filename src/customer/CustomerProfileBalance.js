import "./css/CustomerProfileBalance.css";
import "../common/css/Data.css";

import { FaCoins } from "react-icons/fa6";

import React, { useContext, useState, useEffect } from "react";
import { toast, Flip } from 'react-toastify';
import Modal from 'react-modal';

import { UserContext } from "../App";
import OrderController from "../class/controllers/OrderController"; 
import PaymentController from "../class/controllers/PaymentController";
import OrderStatusIndicator from "../common/OrderStatusIndicator";


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
            
            // Log the status to verify its exact value
    
            if (transactionToPay.status && transactionToPay.status.toLowerCase() === "paid") {
                toast.info("This transaction is already paid.", {
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
                return;
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
        <div id='customerProfileBalance' className="dataCard">

            <div className="dataCard-header">
              <div className="dataCard-header-left">
                <FaCoins />
                <h1>Remaining Balance</h1>
              </div>
            </div>

            {balanceTransactions.length === 0 ? (
                <div className="dataCard-text-section">

                    <h1>No balance found for this user</h1>

                </div>
            ) : (
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
                                <td><OrderStatusIndicator status={transaction.status} /></td>
                                <td>₱{transaction.remainingBalance}</td>
                                <td className='transactionDate'>{formatDate(transaction.createdDate)}</td>       
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <div className="dataCard-footer">

            </div>

        </div>
    );
    
};

export default CustomerProfileBalance;