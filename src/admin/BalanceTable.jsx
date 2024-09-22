import React, { useEffect, useState } from "react";
import OrderController from "../class/controllers/OrderController"; // Import OrderController
import "../css/Admin/BalanceTable.css";

const BalanceTable = () => {
  const [balances, setBalances] = useState([]);
  const [selectedTransactions, setSelectedTransactions] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // Fetch balances
  const fetchBalances = async () => {
    try {
      // Fetch balance documents directly
      const balanceDocs = await OrderController.getBalanceDocuments(); // New method to get balance documents
      const balancesList = await Promise.all(balanceDocs.map(async (doc) => {
        const balanceData = await OrderController.fetchUserBalance(doc.id); // Using doc.id for user email
        return {
          userEmail: doc.id,
          remainingBalance: balanceData.remainingBalance,
          status: balanceData.status,
          transactions: balanceData.transactions,
        };
      }));

      setBalances(balancesList);
    } catch (error) {
      console.error("Error fetching balances:", error);
    }
  };

  useEffect(() => {
    fetchBalances();
  }, []);

  // Handle viewing transactions for a selected user
  const handleViewTransactions = (userEmail) => {
    const userBalance = balances.find(balance => balance.userEmail === userEmail);
    if (userBalance) {
      setSelectedTransactions(userBalance.transactions);
      setShowModal(true);
    }
  };

  // Handle status change for a transaction
  const handleStatusChange = async (transactionId, newStatus) => {
    const userEmail = selectedTransactions[0]?.userEmail; // Get the email from the selected transactions
    if (!userEmail) return; // Ensure email is available

    try {
      await OrderController.updateTransactionStatus(userEmail, transactionId, newStatus);
      const updatedTransactions = selectedTransactions.map(transaction =>
        transaction.id === transactionId ? { ...transaction, status: newStatus } : transaction
      );
      setSelectedTransactions(updatedTransactions);
      console.log(`Status for transaction ${transactionId} updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating transaction status:", error);
    }
  };

  return (
    <div className="balanceTableContainer">
      <h2>Balance Management</h2>
      <div className="tableWrapper">
        <table className="balanceTable">
          <thead>
            <tr>
              <th>User Email</th>
              <th>Status</th>
              <th>Amount</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {balances.map((balance) => (
              <tr key={balance.userEmail}>
                <td>{balance.userEmail}</td>
                <td>{balance.status}</td>
                <td>₱{balance.remainingBalance}</td>
                <td>
                  <button onClick={() => handleViewTransactions(balance.userEmail)}>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal">
          <h3>Transaction Details</h3>
          <ul>
            {selectedTransactions.map((transaction) => (
              <li key={transaction.id}>
                {`Transaction Number: ${transaction.id}, Status: ${transaction.status}, Remaining Balance: ₱${transaction.remainingBalance}`}
                <select
                  value={transaction.status}
                  onChange={(e) => handleStatusChange(transaction.id, e.target.value)} // Pass only necessary params
                >
                  <option value="paid">Paid</option>
                  <option value="unpaid">Unpaid</option>
                </select>
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
