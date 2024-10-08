import React, { useEffect, useState } from 'react';
import OrderController from '../class/controllers/OrderController';
import "../css/Admin/OrderCancellationRequests.css";
import Admin from '../class/admin/Admin';

const OrderCancellationRequests = () => {
    const [requests, setRequests] = useState([]);

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
        <div className="cancellationTableContainer">
            <h2>Order Cancellation Requests</h2>
            {requests.length === 0 ? (
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
                            {requests.map((request) => (
                                <tr key={request.id}>
                                    <td>{request.id}</td>
                                    <td>{request.userEmail}</td>
                                    <td>{request.referenceNumber}</td>
                                    <td>{request.status}</td>
                                    <td>
                                        <button className="confirmButton" onClick={() => handleConfirm(request)}>Confirm</button>
                                        <button className="rejectButton" onClick={() => handleReject(request)}>Reject</button>
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
