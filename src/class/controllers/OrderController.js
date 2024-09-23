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
                await this.storeRemainingBalance(email, remainingBalance); // Updated: no reference number passed
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
            const referenceNumber = this.generateReferenceNumber(); // Generate a new reference number for the transaction
            const transactionData = {
                remainingBalance,
                status: remainingBalance > 0 ? "unpaid" : "paid", // Set status based on remaining balance
                createdDate: new Date(),
            };
    
            // Create a new transaction entry in the "transactions" sub-collection using the generated reference number
            await FService.setDocument(transactionPath, referenceNumber, transactionData); // Storing balance transaction
            console.log("New balance transaction created successfully.");
    
            return {
                id: referenceNumber,
                ...transactionData,
            };
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

    static async fetchBalances() {
        try {
            const balancesSnapshot = await FService.getDocuments("Balance");
            const balances = [];
    
            for (const doc of balancesSnapshot.docs) {
                const balanceData = doc.data();
                const userEmail = doc.id;
    
                // Fetch transactions for this user
                const transactionsPath = `Balance/${userEmail}/transactions`;
                const transactionsSnapshot = await FService.getDocuments(transactionsPath);
    
                const transactions = transactionsSnapshot.docs.map(transactionDoc => ({
                    id: transactionDoc.id,
                    ...transactionDoc.data(),
                }));
    
                balances.push({
                    userEmail,
                    remainingBalance: balanceData.remainingBalance || 0,
                    status: balanceData.status || "No status",
                    createdDate: balanceData.createdDate || new Date(),
                    transactions,
                });
            }
    
            console.log("Processed balances:", balances);
            return balances;
        } catch (error) {
            console.error("Error fetching balances:", error);
            throw error;
        }
    }    

    // Method to fetch transactions for a specific user
    static async fetchUserTransactions(userEmail) {
        try {
            console.log(`Fetching transactions for user: ${userEmail}`);
            
            const transactionsPath = `Balance/${userEmail}/transactions`;
            const transactionSnapshots = await FService.getDocuments(transactionsPath);
    
            // Check if there are any transactions
            if (transactionSnapshots.empty) {
                console.log(`No transactions found for user: ${userEmail}`);
                return []; // Return an empty array if no transactions exist
            }
    
            // Process the fetched transactions
            const transactions = transactionSnapshots.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
    
            console.log(`Fetched ${transactions.length} transactions for user: ${userEmail}`);
            return transactions;
        } catch (error) {
            console.error(`Error fetching transactions for user ${userEmail}:`, error);
            throw error; // Rethrow the error for handling upstream
        }
    }
    


    static generateReferenceNumber() {
        return Math.floor(Math.random() * 1000000000).toString();
    }

}

export default OrderController;
