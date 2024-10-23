import React, { useEffect, useState } from "react";
import PaymentController from "../class/controllers/PaymentController";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import * as XLSX from 'xlsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/Admin/FinanceDashboard.css';
import HeaderAdmin from "./HeaderAdmin";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [showRefundsOnly, setShowRefundsOnly] = useState(false); // Refund filter state

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const paymentData = await PaymentController.getAllPayments();
      if (paymentData.length > 0) {
        const refunds = await PaymentController.getAllRefunds();
        const refundMap = new Map(refunds.map((refund) => [refund.attributes.payment_id, refund]));
        const updatedPayments = paymentData.map((payment) => {
          if (refundMap.has(payment.id)) {
            payment.attributes.status = "refunded";
          }
          return payment;
        });
        setPayments(updatedPayments);
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
      const refunds = await PaymentController.getAllRefunds();
      const refundForPayment = refunds.find(refund => refund.attributes.payment_id === paymentId);
      if (refundForPayment) {
        paymentData.attributes.status = "refunded";
      }
      setSelectedPayment(paymentData);
      setShowModal(true);
    } catch (err) {
      console.error("Failed to fetch payment details:", err);
      setError("Failed to fetch payment details. Please try again later.");
    }
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value, 10));
    setCurrentPage(1); // Reset to first page when limit changes
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset to first page on search
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
      const amount = selectedPayment.attributes.amount / 100;
      const reason = "requested_by_customer";
      await PaymentController.createRefund(selectedPayment.id, amount, reason);
      setRefundSuccess("Refund created successfully.");
      await PaymentController.updatePaymentStatus(selectedPayment.id, 'refunded');
      fetchPayments(); // Refresh payments after refund
    } catch (err) {
      console.error("Failed to create refund:", err);
      setRefundError("Failed to create refund. Please try again later.");
    } finally {
      setRefundLoading(false);
    }
  };

  const filteredPayments = payments.filter((payment) =>
    (showRefundsOnly ? payment.attributes.status === "refunded" : true) &&
    (payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.attributes.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.attributes.status.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredPayments.length / limit);
  const displayedPayments = filteredPayments.slice((currentPage - 1) * limit, currentPage * limit);

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

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const toggleRefundList = () => {
    setShowRefundsOnly(!showRefundsOnly);
    setCurrentPage(1); // Reset to first page when toggling refund list
  };

  return (
    <div className="finance-dashboard">
      <HeaderAdmin />
      <div className="content">
        <h1>Finance Dashboard</h1>
        <div className="table-frame">
          <div className="table-header">
            <div className="filters">
              <div className="filter-item">
                <label htmlFor="rowLimit" className="form-label">Rows per page:</label>
                <select id="rowLimit" className="form-select" value={limit} onChange={handleLimitChange}>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
              <div className="filter-item">
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
              <div className="filter-item">
                <Button onClick={toggleRefundList} className="btn btn-info toggle-button">
                  {showRefundsOnly ? "Show All Payments" : "Show Refunds Only"}
                </Button>
              </div>
            </div>
            <div className="download-button">
              <button className="btn btn-primary" onClick={downloadExcel}>
                Download Excel
              </button>
            </div>
          </div>
          <div className="payments-table">
            {loading ? (
              <div className="loading">Loading...</div>
            ) : error ? (
              <div className="alert alert-danger">{error}</div>
            ) : (
              <>
                <Table striped bordered hover responsive="sm">
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
                <div className="pagination">
                  {[...Array(totalPages)].map((_, index) => (
                    <Button
                      key={index}
                      variant={currentPage === index + 1 ? "primary" : "secondary"}
                      onClick={() => handlePageChange(index + 1)}
                      className="mx-1"
                    >
                      {index + 1}
                    </Button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <Modal show={showModal} onHide={handleCloseModal}>
      <Modal.Header closeButton>
         <Modal.Title>Payment Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
         {selectedPayment ? (
             <>
        <p><strong>Payment ID:</strong> {selectedPayment.id}</p>
        <p><strong>Amount (PHP):</strong> {(selectedPayment.attributes.amount / 100).toFixed(2)}</p>
        <p><strong>Description:</strong> {selectedPayment.attributes.description || "N/A"}</p>
        <p><strong>Status:</strong> {selectedPayment.attributes.status}</p>
        <p><strong>Created At:</strong> {new Date(selectedPayment.attributes.created_at * 1000).toLocaleString()}</p>
        {selectedPayment.attributes.status === "refunded" && <p><strong>Refund Status:</strong> Refunded</p>}
      </>
    ) : (
      <p>Loading payment details...</p>
    )}
   </Modal.Body>
   <Modal.Footer>
    {refundError && <div className="alert alert-danger">{refundError}</div>}
    {refundSuccess && <div className="alert alert-success">{refundSuccess}</div>}
    {selectedPayment && selectedPayment.attributes.status === "refunded" ? (
      <Button variant="secondary" disabled>
        Refunded
      </Button>
    ) : (
      selectedPayment && selectedPayment.attributes.status !== "refunded" && (
        <Button variant="danger" onClick={handleRefund} disabled={refundLoading}>
          {refundLoading ? "Processing..." : "Refund Payment"}
        </Button>
      )
    )}
    </Modal.Footer>
   </Modal>
    </div>
  );
};

export default FinanceDashboard;
