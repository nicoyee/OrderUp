import { FService } from "./FirebaseService.ts";
import { Order } from "../Order.ts";

class OrderController {
    
    static async createOrder(orderDetails) {
        try {
            const { email, receiverName, contactNo, address, paymentOption, items, totalAmount } = orderDetails;
            const referenceNumber = this.generateReferenceNumber();
            
            if (!email) {
                throw new Error("User email is undefined");
            }

            const orderData = {
                userEmail: email,
                receiverName,
                contactNo,
                address,
                paymentOption,
                items,
                totalAmount,
                status: "pending", // default status
                createdDate: new Date(),
                referenceNumber: referenceNumber
            };

            // Create Order document in Firestore
            const path = `Orders/${email}/orders`;
            await FService.setDocument(path, referenceNumber, orderData);
            console.log("Order created successfully.");

            // If the user chose downpayment, calculate and store remaining balance in separate collection
            if (paymentOption === "downpayment") {
                const remainingBalance = totalAmount * 0.8; // 80% remaining after downpayment
                await this.storeRemainingBalance(email, remainingBalance);
            }

            return referenceNumber; // Return reference number for further use
        } catch (error) {
            console.error("Error creating order:", error.message || error);
            throw error;
        }
    }

    static async storeRemainingBalance(userEmail, remainingBalance) {
        try {
            if (!userEmail) {
                throw new Error("User email is undefined");
            }

            const balancePath = `Balance/${userEmail}`;
            const balanceData = {
                remainingBalance,
                updatedDate: new Date(),
            };

            // Store balance in the separate "Balance" collection
            const existingBalance = await FService.getDocument("Balance", userEmail);
            
            if (existingBalance.exists()) {
                // Update existing balance
                await FService.updateDocument("Balance", userEmail, balanceData);
                console.log("Balance updated successfully in separate collection.");
            } else {
                // Create new balance entry in "Balance" collection
                await FService.setDocument("Balance", userEmail, balanceData);
                console.log("Balance created successfully in separate collection.");
            }
        } catch (error) {
            console.error("Error storing balance:", error.message || error);
            throw error;
        }
    }


    // Method to fetch all orders
    static async getOrders(userEmail) {
        try {
            const ordersCollectionPath = `Orders/${userEmail}/orders`;
            const querySnapshot = await FService.getDocuments(ordersCollectionPath);
            const orders = [];

            querySnapshot.forEach((doc) => {
                const orderData = doc.data();
                orders.push({
                    ...orderData,
                    userEmail: userEmail
                });
            });
            return orders;
        } catch (error) {
            console.error("Error fetching orders:", error);
            throw error;
        }
    }

    static async viewHistory(userEmail) {
        try {
            const ordersCollectionPath = `Orders/${userEmail}/orders`;
            const querySnapshot = await FService.getDocuments(ordersCollectionPath);
            const orders = [];

            querySnapshot.forEach((doc) => {
                const orderData = doc.data();
                orders.push({
                    ...orderData,
                    userEmail,
                });
            });
            return orders;
        } catch (error) {
            console.error("Error fetching order history:", error);
            throw error;
        }
    }


    // Method to update the order status (e.g., to 'completed', 'shipped', etc.)
    static async updateStatus(userEmail, referenceNumber, newStatus) {
        try {
            const path = `Orders/${userEmail}/orders`;
            await FService.updateDocument(path, referenceNumber, { status: newStatus });
            console.log("Order status updated successfully.");
        } catch (error) {
            console.error("Error updating order status:", error);
            throw error;
        }
    }

    
    static generateReferenceNumber() {
        return Math.floor(Math.random() * 1000000000).toString();
    }

}

export default OrderController;
