import "./css/AdminBalanceCancellationRequests.css";

import { FaCheck } from "react-icons/fa6";
import { FaBan } from "react-icons/fa";

import React, { useContext, useState, useEffect } from "react";

import Admin from '../class/admin/Admin';

const AdminBalanceCancellationRequests = () => {

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
        <div id="adminBalanceCancellationRequests" className="dataCard table">

            <div className="dataCard-header">
                <h1>Cancellation Requests</h1>
            </div>

            { requests.length === 0 ? (
                <div className="dataCard-content info">
                    <p>No cancellation requests at this moment</p>
                </div>
            ) : (
                <div className="dataCard-content full">
                    <table>

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
                            { requests.map((request) => (
                                <tr key={request.id}>
                                    <td>{request.id}</td>
                                    <td>{request.userEmail}</td>
                                    <td>{request.referenceNumber}</td>
                                    <td>{request.status}</td>
                                    <td>
                                        <div className="tableCell">
                                            <button 
                                                className="secondaryButton tooltip green" 
                                                onClick={() => handleConfirm(request)}
                                            >
                                                <span>Accept</span>
                                                <FaCheck/>
                                            </button>
                                            <button 
                                                className="secondaryButton tooltip red" 
                                                onClick={() => handleReject(request)}
                                            >
                                                <span>Reject</span>
                                                <FaBan/>
                                            </button>
                                        </div>
                                    </td>
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

export default AdminBalanceCancellationRequests;