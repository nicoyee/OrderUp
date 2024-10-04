import React, { useEffect, useState } from 'react';
import OrderController from '../class/controllers/OrderController';
import "../css/Admin/OrderCancellationRequests.css";
import Admin from '../class/admin/Admin';

const OrderCancellationRequests = () => {
    const [cancellationRequests, setCancellationRequests] = useState([]);

    useEffect(() => {
        const fetchCancellationRequests = async () => {
            try {
                const requests = await Admin.fetchCancellationRequests();
                setCancellationRequests(requests);
                console.log("Cancellation Requests Fetched:", requests);
            } catch (error) {
                alert(error.message);
            }
        };

        fetchCancellationRequests();
    }, []);

    const handleConfirm = async (requestId) => {
        try {
            await Admin.approveCancellation(requestId);
            setCancellationRequests((prev) => prev.filter(req => req.id !== requestId));
        } catch (error) {
            alert(error.message);
        }
    };

    const handleReject = async (requestId) => {
        try {
            await Admin.rejectCancellation(requestId); // Reject the cancellation using Admin class
            setCancellationRequests((prev) => prev.filter(req => req.id !== requestId));
        } catch (error) {
            alert(error.message);
        }
    };


    return (
        <div className="cancellationTableContainer">
            <h2>Order Cancellation Requests</h2>
            {cancellationRequests.length === 0 ? (
                <p className="noRequestsMessage">No cancellation requests available.</p>
            ) : (
                <div className="tableWrapper">
                    <table className="cancellationTable">
                        <thead>
                            <tr>
                                <th>Request ID</th>
                                <th>User Email</th>
                                <th>Order Reference No.</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cancellationRequests.map((request) => (
                                <tr key={request.id}>
                                    <td>{request.id}</td>
                                    <td>{request.userEmail}</td>
                                    <td>{request.referenceNumber}</td>
                                    <td>{request.status}</td>
                                    <td>
                                        <button className="confirmButton" onClick={() => handleConfirm(request.id)}>Confirm</button>
                                        <button className="rejectButton" onClick={() => handleReject(request.id)}>Reject</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};


export default OrderCancellationRequests;
