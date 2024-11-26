import "./css/AdminBalanceBalanceTable.css";

import React, { useContext, useState, useEffect } from "react";
import Modal from 'react-modal';

import Admin from '../class/admin/Admin';
import OrderController from "../class/controllers/OrderController";

import Loading from '../common/Loading';

const AdminBalanceBalanceTable = () => {

    const [ loading, setLoading ] = useState(true);
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
                    const userBalances = await Admin.getUserTransactions(user.email);
                    allBalances.push(...userBalances);
                }
                allBalances.sort((a, b) => b.createdDate.seconds - a.createdDate.seconds);
                setBalances(allBalances);
                console.log('Balances Fetched:', allBalances);
            } catch (err) {
                console.error("Error fetching balances:", err);
            } finally {
                setLoading(false);
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
        <div id="adminBalanceBalanceTable" className="dataCard table">

            <div className="dataCard-header">
                <h1>Customer Balance</h1>
            </div>

            <div className="dataCard-content full">
            { loading ? (
                <Loading />     
            ) : (
                <table>
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
                                    <option value="cancelled">Cancelled</option>
                                    <option value="refunded">Refunded</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
            </div>

            <div className="dataCard-footer">
                
            </div>

        </div>
    );
    
};

export default AdminBalanceBalanceTable;