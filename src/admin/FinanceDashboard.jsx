import React, { useEffect, useState } from "react";
import PaymentController from "../class/controllers/PaymentController";

const FinanceDashboard = () => {
  const [paymentLinks, setPaymentLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPaymentLinks = async () => {
      try {
        setLoading(true);
        const links = await PaymentController.fetchAllPaymentLinks();
        setPaymentLinks(links);
      } catch (err) {
        setError("Failed to fetch payment links");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentLinks();
  }, []);

  return (
    <div>
      <h1>Finance Dashboard</h1>
      {loading ? (
        <p>Loading payment links...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <table border="1" cellPadding="10" cellSpacing="0">
          <thead>
            <tr>
              <th>ID</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Checkout URL</th>
            </tr>
          </thead>
          <tbody>
            {paymentLinks.map((link) => (
              <tr key={link.id}>
                <td>{link.id}</td>
                <td>{link.attributes.description}</td>
                <td>{link.attributes.amount / 100}</td>
                <td>{link.attributes.status}</td>
                <td>
                  <a href={link.attributes.checkout_url} target="_blank" rel="noopener noreferrer">
                    {link.attributes.checkout_url}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default FinanceDashboard;
