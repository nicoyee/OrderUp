import React, { useEffect, useState } from "react";
import Admin from "../class/admin/Admin";
import OrderController from "../class/controllers/OrderController";
import "../css/Admin/BalanceTable.css";

const BalanceTable = () => {
    const [users, setUsers] = useState([]);
    const [balances, setBalances] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const balancesPerPage = 10;

    useEffect(() => {
        const fetchUsersAndBalances = async () => {
            try {
                const usersData = await Admin.fetchUsers();
                setUsers(usersData);

                const allBalances = [];
                for (const user of usersData) {
                    const userBalances = await OrderController.fetchTransactions(user.email);
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

    const handleStatusChange = async (userEmail, transactionId, newStatus) => {
        try {
            await OrderController.updateBalanceStatus(userEmail, transactionId, newStatus);
            const updatedBalances = balances.map(balance =>
                balance.id === transactionId ? { ...balance, status: newStatus } : balance
            );
            setBalances(updatedBalances);
            console.log(`Balance status updated to ${newStatus} for ${userEmail}`);
        } catch (error) {
            console.error("Error updating balance status:", error);
        }
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
                        <tr key={balance.id}>
                            <td>{balance.userEmail}</td>
                            <td>{balance.status}</td>
                            <td>₱{balance.remainingBalance}</td>
                            <td>{new Date(balance.createdDate.seconds * 1000).toLocaleString()}</td>
                            <td>
                                <select
                                    value={balance.status}
                                    onChange={(e) => handleStatusChange(balance.userEmail, balance.id, e.target.value)}
                                >
                                    <option value="unpaid">Unpaid</option>
                                    <option value="paid">Paid</option>
                                </select>
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
        </div>
    );
};

export default BalanceTable;
