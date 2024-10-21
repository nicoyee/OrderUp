import React, { useEffect, useState } from "react";
import PaymentController from "../class/controllers/PaymentController";
import Table from "react-bootstrap/Table";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/Admin/FinanceDashboard.css';

const FinanceDashboard = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [limit, setLimit] = useState(10); // Default limit to 10
  const [totalPayments, setTotalPayments] = useState(0);

  const fetchPayments = async (cursor = null, direction = "next") => {
    try {
      console.log("Fetching payments...", { cursor, direction });
      setLoading(true);
      const limit = 50; // Set the limit to 50
      let paymentData = [];
      
      // Call the getAllPayments method with limit and cursor
      paymentData = await PaymentController.getAllPayments(limit, direction === "next" ? cursor : null, direction === "previous" ? cursor : null);
      
      console.log("Payments fetched:", paymentData);
      if (paymentData.length > 0) {
        // Update your cursor logic as needed
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

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value, 10));
  };

  // Calculate the displayed payments based on the selected limit
  const displayedPayments = payments.slice(0, limit);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-danger">{error}</div>;
  }

  return (
    <div className="container mt-5">
      <h2>Finance Dashboard</h2>

      {/* Dropdown for selecting row limit */}
      <div className="mb-3">
        <label htmlFor="rowLimit" className="form-label">Rows per page:</label>
        <select id="rowLimit" className="form-select" value={limit} onChange={handleLimitChange}>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
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
              <tr key={payment.id}>
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
    </div>
  );
};

export default FinanceDashboard;
