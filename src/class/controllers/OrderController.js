import { FService } from "./FirebaseService.ts";
import { Order } from "../Order.ts";
import { Balance } from "../Balance.ts";

class OrderController {
    
    static async createOrder(orderDetails) {
        try {
            const { email, receiverName, contactNo, address, paymentOption, items, totalAmount } = orderDetails;
            const referenceNumber = this.generateReferenceNumber();
            
            if (!email) {
                throw new Error("User email is undefined");
            }

            // Check if the user has an unpaid balance
            const userBalanceDoc = await FService.getDocument("Balance", email);
            let balance = new Balance(email);
            if (userBalanceDoc.exists()) {
                const balanceData = userBalanceDoc.data();
                balance.remainingBalance = balanceData.remainingBalance || 0;
                balance.status = balanceData.status || "unpaid";
            }

            if (balance.remainingBalance > 0 && balance.status !== "paid") {
                throw new Error("You cannot create a new order with an unpaid balance.");
            }

            // Order data to be stored
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
            await FService.setDocument(path, referenceNumber, orderData); // Storing order in Firestore
            console.log("Order created successfully.");

            // If the user chose downpayment, calculate and store remaining balance in separate collection
            if (paymentOption === "downpayment") {
                const remainingBalance = totalAmount * 0.8; // 80% remaining after downpayment
                await this.storeRemainingBalance(email, remainingBalance); // Storing remaining balance
            }

            return referenceNumber; // Return reference number for further use
        } catch (error) {
            console.error("Error creating order:", error.message || error);
            throw error;
        }
    }
    
    // Separate method to store remaining balance in Firestore
    static async storeRemainingBalance(userEmail, remainingBalance) {
        try {
            if (!userEmail) {
                throw new Error("User email is undefined");
            }

            const transactionPath = `Balance/${userEmail}/transactions`;
            const transactionData = {
                remainingBalance,
                status: remainingBalance > 0 ? "unpaid" : "paid", // Set status based on remaining balance
                createdDate: new Date(),
            };

            // Create a new transaction entry in the "transactions" sub-collection using the reference number
            await FService.setDocument(transactionPath, this.generateReferenceNumber(), transactionData); // Storing balance transaction
            console.log("New balance transaction created successfully.");
        } catch (error) {
            console.error("Error storing balance transaction:", error.message || error);
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

    static async fetchUserBalance(userEmail) {
        try {
            if (!userEmail) {
                throw new Error("User email is undefined");
            }

            // Fetch the balance document
            const userBalanceDoc = await FService.getDocument("Balance", userEmail);
            if (!userBalanceDoc.exists()) {
                return {
                    remainingBalance: 0,
                    status: "unpaid",
                    transactions: [],
                };
            }

            const userBalanceData = userBalanceDoc.data();

            // Fetching transactions for the user
            const transactionsCollectionPath = `Balance/${userEmail}/transactions`;
            const transactionsSnapshot = await FService.getDocuments(transactionsCollectionPath);
            const transactions = [];

            transactionsSnapshot.forEach((doc) => {
                const transactionData = doc.data();
                transactions.push({
                    ...transactionData,
                    id: doc.id // Add the document ID for later reference
                });
            });

            return {
                remainingBalance: userBalanceData.remainingBalance || 0,
                status: userBalanceData.status || "unpaid",
                transactions, // Return the user's transactions as well
            };
        } catch (error) {
            console.error("Error fetching user balance:", error);
            throw error;
        }
    }

    static async updateTransactionStatus(userEmail, transactionId, newStatus) {
        try {
            const transactionPath = `Balance/${userEmail}/transactions`;
            await FService.updateDocument(transactionPath, transactionId, { status: newStatus });
            console.log("Transaction status updated successfully.");
        } catch (error) {
            console.error("Error updating transaction status:", error);
            throw error;
        }
    }

    static async getBalanceDocuments() {
        try {
            const path = "Balance"; // Path to the balance collection
            const querySnapshot = await FService.getDocuments(path);
            return querySnapshot.docs; // Return documents
        } catch (error) {
            console.error("Error fetching balance documents:", error);
            throw error;
        }
    }
    
    
    
    static generateReferenceNumber() {
        return Math.floor(Math.random() * 1000000000).toString();
    }

}

export default OrderController;
