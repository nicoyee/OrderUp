import React, { useEffect, useState } from "react";
import Admin from "../class/admin/Admin";
import "../css/Admin/BalanceTable.css";

const BalanceTable = () => {
    const [users, setUsers] = useState([]);
    const [balances, setBalances] = useState([]);
    const [selectedBalance, setSelectedBalance] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const balancesPerPage = 10;

    useEffect(() => {
        const fetchUsersAndBalances = async () => {
            try {
                const usersData = await Admin.fetchUsers();
                setUsers(usersData);

                const allBalances = [];
                for (const user of usersData) {
                    const userBalances = await Admin.fetchBalances(user.email);
                    allBalances.push(...userBalances);
                }
                allBalances.sort((a, b) => b.createdDate.seconds - a.createdDate.seconds);
                setBalances(allBalances);
                console.log('Balances Fetched:', allBalances);
            } catch (err) {
                console.error("Error fetching balances:", err);
            }
        };

        fetchUsersAndBalances();
    }, []);



  const indexOfLastBalance = currentPage * balancesPerPage;
  const indexOfFirstBalance = indexOfLastBalance - balancesPerPage;
  const currentBalances = balances.slice(indexOfFirstBalance, indexOfLastBalance);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const openTransactionModal = (balance) => {
    setSelectedBalance(balance);
    setShowModal(true);
  };

  const closeTransactionModal = () => {
    setSelectedBalance(null);
    setShowModal(false);
  };

    return (
    <div className="balanceTableContainer">
      <h2>Balance Management</h2>
      <table className="balanceTable">
        <thead>
          <tr>
            <th>Email</th>
            <th>Status</th>
            <th>Remaining Balance</th>
            <th>Created Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentBalances.map((balance) => (
            <tr key={balance.userEmail}>
              <td>{balance.userEmail}</td>
              <td>{balance.status}</td>
              <td>₱{balance.remainingBalance}</td>
              <td>{new Date(balance.createdDate.seconds * 1000).toLocaleString()}</td>
              <td>
                <button onClick={() => openTransactionModal(balance)}>View Transactions</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        {balances.length > balancesPerPage && (
          <div>
            <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
              Previous
            </button>
            {Array.from({ length: Math.ceil(balances.length / balancesPerPage) }, (_, i) => (
              <button key={i + 1} onClick={() => paginate(i + 1)} className={currentPage === i + 1 ? 'active' : ''}>
                {i + 1}
              </button>
            ))}
            <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === Math.ceil(balances.length / balancesPerPage)}>
              Next
            </button>
          </div>
        )}
      </div>

      {showModal && selectedBalance && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeTransactionModal}>&times;</span>
            <h3>Transaction Details</h3>
            <ul>
              {selectedBalance.transactions && selectedBalance.transactions.length > 0 ? (
                selectedBalance.transactions.map((transaction) =>(
                    <li key={transaction.id}>
                    {`Reference Number: ${transaction.id}, Status: ${transaction.status}, Remaining Balance: ₱${transaction.remainingBalance}, Date: ${new Date(transaction.createdDate.seconds * 1000).toLocaleString()}`}
                    </li>
                ))
            ) : (
                <li>No transactions available.</li>
              )}
            </ul>
            <button onClick={closeTransactionModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BalanceTable;