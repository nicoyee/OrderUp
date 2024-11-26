import "./css/AdminBalance.css";

import React, { useEffect, useState, useContext } from 'react';

import Admin from "../../class/admin/Admin";
import OrderController from "../../class/controllers/OrderController";

const AdminBalance = () => {

    const [users, setUsers] = useState([]);
    const [balances, setBalances] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const balancesPerPage = 10;
    const [requests, setRequests] = useState([]);

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
            }
        };

        fetchUsersAndBalances();
    }, []);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const cancellationRequests = await Admin.fetchCancellationRequests();
                const refundRequests = await Admin.fetchRefundRequests();

                const allRequests = [
                    ...cancellationRequests.map(req => ({ ...req, type: 'cancellation' })),
                    ...refundRequests.map(req => ({ ...req, type: 'refund' }))
                ];

                setRequests(allRequests);
                console.log("All Requests Fetched:", allRequests);
            } catch (error) {
                alert(error.message);
            }
        };

        fetchRequests();
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

    const handleConfirm = async (request) => {
        try {
            if (request.type === 'cancellation') {
                await Admin.approveCancellation(request.id);
            } else if (request.type === 'refund') {
                await Admin.approveRefund(request.id);
            }
            setRequests((prev) => prev.filter(req => req.id !== request.id));
        } catch (error) {
            alert(error.message);
        }
    };

    const handleReject = async (request) => {
        try {
            if (request.type === 'cancellation') {
                await Admin.rejectCancellation(request.id);
            } else if (request.type === 'refund') {
                await Admin.rejectRefund(request.id);
            }
            setRequests((prev) => prev.filter(req => req.id !== request.id));
        } catch (error) {
            alert(error.message);
        }
    };


    return (
        <div id="adminBalance">

            <div className="sectionContainer">
                <div className="dataCard">
                    <div className="dataCard-header">
                        <div className="dataCard-header-left">
                            <h1>Balance</h1>
                        </div>
                    </div>

                    <div className="dataCard-section">

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

                    </div>

                </div>
            </div>

        </div>
    );

};

export default AdminBalance;