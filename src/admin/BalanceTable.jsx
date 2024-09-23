import React, { useEffect, useState } from "react";
import OrderController from "../class/controllers/OrderController";
import "../css/Admin/BalanceTable.css";

const BalanceTable = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [balances, setBalances] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedTransactions, setSelectedTransactions] = useState([]);

    useEffect(() => {
        const fetchBalances = async () => {
            setLoading(true);
            setError(null);
            try {
                const usersData = await OrderController.getAllBalances();
                
                if (usersData.length === 0) {
                    setError("No users found with balances.");
                    return;
                }
    
                const allBalances = [];
        
                for (const user of usersData) {
                    const userEmail = user.userEmail;
    
                    const latestTransaction = user.transactions.length > 0 ? user.transactions[user.transactions.length - 1] : null;
        
                    allBalances.push({
                        userEmail,
                        remainingBalance: latestTransaction ? latestTransaction.remainingBalance : 0,
                        status: latestTransaction ? latestTransaction.status : 'No transactions',
                        createdDate: latestTransaction ? latestTransaction.createdDate : new Date(),
                        transactions: user.transactions,
                    });
                }
    
                setBalances(allBalances);
            } catch (err) {
                console.error("Error fetching balances:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
    
        fetchBalances();
    }, []);
    

    const handleViewTransactions = (userEmail) => {
        const userBalance = balances.find((balance) => balance.userEmail === userEmail);
        if (userBalance) {
            setSelectedTransactions(userBalance.transactions);
            setShowModal(true);
        }
    };

    return (
        <div className="balanceTableContainer">
            <h2>Balance Management</h2>
            {loading && <p>Loading balances...</p>}
            {error && <p className="error">{error}</p>}
            {!loading && (
                <div className="tableWrapper">
                    <table className="balanceTable">
                        <thead>
                            <tr>
                                <th>User Email</th>
                                <th>Status</th>
                                <th>Remaining Balance</th>
                                <th>Created Date</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {balances.map((balance) => (
                                <tr key={balance.userEmail}>
                                    <td>{balance.userEmail}</td>
                                    <td>{balance.status}</td>
                                    <td>₱{balance.remainingBalance}</td>
                                    <td>{new Date(balance.createdDate.seconds * 1000).toLocaleString()}</td>
                                    <td>
                                        <button onClick={() => handleViewTransactions(balance.userEmail)}>View Transactions</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {showModal && (
                <div className="modal">
                    <h3>Transaction Details</h3>
                    <ul>
                        {selectedTransactions.map((transaction) => (
                            <li key={transaction.id}>
                                {`Reference Number: ${transaction.id}, Status: ${transaction.status}, Remaining Balance: ₱${transaction.remainingBalance}, Date: ${new Date(transaction.createdDate.seconds * 1000).toLocaleString()}`}
                            </li>
                        ))}
                    </ul>
                    <button onClick={() => setShowModal(false)}>Close</button>
                </div>
            )}
        </div>
    );
};

export default BalanceTable;
