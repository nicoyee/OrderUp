import React from 'react';
import '../css/OrderHistoryAdmin.css'

const OrderHistoryAdmin = () => {
    return (
        <div className="order-history-container">
            <h2>Order History</h2>

            {/* Container for the three forms */}
            <div className="forms-container">
                {/* Form for Ongoing Orders */}
                <form className="order-form order-form-ongoing">
                    <fieldset>
                        <legend>Ongoing Orders</legend>
                        <table className="order-table order-table-ongoing">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Customer</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Render ongoing orders here */}
                            </tbody>
                        </table>
                    </fieldset>
                </form>

                {/* Form for Completed Orders */}
                <form className="order-form order-form-completed">
                    <fieldset>
                        <legend>Completed Orders</legend>
                        <table className="order-table order-table-completed">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Customer</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Render completed orders here */}
                            </tbody>
                        </table>
                    </fieldset>
                </form>

                {/* Form for Cancelled Orders */}
                <form className="order-form order-form-cancelled">
                    <fieldset>
                        <legend>Cancelled Orders</legend>
                        <table className="order-table order-table-cancelled">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Customer</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Render cancelled orders here */}
                            </tbody>
                        </table>
                    </fieldset>
                </form>
            </div>
        </div>
    );
};

export default OrderHistoryAdmin;
