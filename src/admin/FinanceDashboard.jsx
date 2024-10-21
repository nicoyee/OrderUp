import React, { useEffect, useState } from "react";
import PaymentController from "../class/controllers/PaymentController";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import * as XLSX from 'xlsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/Admin/FinanceDashboard.css';

const FinanceDashboard = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [refundLoading, setRefundLoading] = useState(false);
  const [refundError, setRefundError] = useState(null);
  const [refundSuccess, setRefundSuccess] = useState(null);

  const fetchPayments = async (cursor = null, direction = "next") => {
    try {
      setLoading(true);
      const paymentData = await PaymentController.getAllPayments(50, direction === "next" ? cursor : null, direction === "previous" ? cursor : null);
      if (paymentData.length > 0) {
        setPayments(paymentData);
      } else {
        console.warn("No payment data available");
      }
    } catch (err) {
      console.error("Failed to fetch payments:", err);
      setError("Failed to fetch payments. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleRowClick = async (paymentId) => {
    try {
      const paymentData = await PaymentController.getPayment(paymentId);
      setSelectedPayment(paymentData);
      setShowModal(true);
    } catch (err) {
      console.error("Failed to fetch payment details:", err);
      setError("Failed to fetch payment details. Please try again later.");
    }
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value, 10));
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPayment(null);
    setRefundError(null);
    setRefundSuccess(null);
  };

  const handleRefund = async () => {
    if (!selectedPayment) return;

    setRefundLoading(true);
    setRefundError(null);
    setRefundSuccess(null);

    try {
      const amount = selectedPayment.attributes.amount / 100; // Refund full amount
      const reason = "requested_by_customer"; // Example reason
      const refundData = await PaymentController.createRefund(selectedPayment.id, amount, reason);
      setRefundSuccess("Refund created successfully.");
      console.log("Refund Data:", refundData);
    } catch (err) {
      console.error("Failed to create refund:", err);
      setRefundError("Failed to create refund. Please try again later.");
    } finally {
      setRefundLoading(false);
    }
  };

  const filteredPayments = payments.filter((payment) =>
    payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.attributes.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.attributes.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayedPayments = filteredPayments.slice(0, limit);

  const downloadExcel = () => {
    const worksheetData = displayedPayments.map((payment) => ({
      'Payment ID': payment.id,
      'Amount (PHP)': (payment.attributes.amount / 100).toFixed(2),
      'Description': payment.attributes.description || "N/A",
      'Status': payment.attributes.status,
      'Created At': new Date(payment.attributes.created_at * 1000).toLocaleString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Payments");

    XLSX.writeFile(workbook, "payments_data.xlsx");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-danger">{error}</div>;
  }

  return (
    <div className="container mt-5">
      <h2>Finance Dashboard</h2>
      <div className="d-flex justify-content-between mb-3">
        <div>
          <label htmlFor="rowLimit" className="form-label">Rows per page:</label>
          <select id="rowLimit" className="form-select" value={limit} onChange={handleLimitChange}>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
        <div>
          <label htmlFor="search" className="form-label">Search Payment:</label>
          <input
            id="search"
            type="text"
            className="form-control"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search payments..."
          />
        </div>
        <div>
          <button className="btn btn-primary" onClick={downloadExcel}>
            Download Excel
          </button>
        </div>
      </div>

      <Table striped bordered hover responsive="sm" className="mt-4">
        <thead>
          <tr>
            <th>Payment ID</th>
            <th>Amount (PHP)</th>
            <th>Description</th>
            <th>Status</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {displayedPayments.length > 0 ? (
            displayedPayments.map((payment) => (
              <tr key={payment.id} onClick={() => handleRowClick(payment.id)} style={{ cursor: "pointer" }}>
                <td>{payment.id}</td>
                <td>{(payment.attributes.amount / 100).toFixed(2)}</td>
                <td>{payment.attributes.description || "N/A"}</td>
                <td>{payment.attributes.status}</td>
                <td>{new Date(payment.attributes.created_at * 1000).toLocaleString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">No payments found</td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Payment Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Payment Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPayment ? (
            <div>
              <p><strong>Payment ID:</strong> {selectedPayment.id}</p>
              <p><strong>Amount:</strong> ₱{(selectedPayment.attributes.amount / 100).toFixed(2)}</p>
              <p><strong>Description:</strong> {selectedPayment.attributes.description || "N/A"}</p>
              <p><strong>Status:</strong> {selectedPayment.attributes.status}</p>
              <p><strong>Payment Method:</strong> {selectedPayment.attributes.payment_method_type}</p>
              <p><strong>Created At:</strong> {new Date(selectedPayment.attributes.created_at * 1000).toLocaleString()}</p>

              {/* Refund Message */}
              {refundError && <p className="text-danger">{refundError}</p>}
              {refundSuccess && <p className="text-success">{refundSuccess}</p>}

              {/* Refund Button */}
              <Button
                variant="danger"
                onClick={handleRefund}
                disabled={refundLoading}
                className="mt-3"
              >
                {refundLoading ? "Processing Refund..." : "Refund"}
              </Button>
            </div>
          ) : (
            <p>Loading payment details...</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default FinanceDashboard;
