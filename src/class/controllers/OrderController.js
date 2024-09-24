    import { FService } from "./FirebaseService.ts";
    import { Order } from "../Order.ts";
    import { Balance } from "../Balance.ts";
import { getDoc } from "firebase/firestore";

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

        static async fetch(userEmail) {
            try {
                const balanceCollectionPath = `Balance/${userEmail}/transactions`;
                const querySnapshot = await FService.getDocuments(balanceCollectionPath);
                const balances = [];

                querySnapshot.forEach((doc) => {
                    const balanceData = doc.data();
                    balances.push({
                        ...balanceData,
                        userEmail,
                    });
                });
                return balances;
            } catch (error) {
                console.error('Error fetching balances:', error);
                throw error;
            }
        }

        // static async fetchTransactions(userEmail) {
        //     try {
        //         const balanceCollectionPath = `Balance/${userEmail}/transactions`;
        //         const querySnapshot = await FService.getDocuments(balanceCollectionPath);
        //         const transactions = [];
        
        //         querySnapshot.forEach((doc) => {
        //             const transactionData = doc.data();
        //             transactions.push({
        //                 id: doc.id,  // Include document ID for reference
        //                 amount: transactionData.remainingBalance,  // Fetch remaining balance as amount
        //                 createdDate: transactionData.createdDate,   // Fetch the transaction's created date
        //                 status: transactionData.status,             // Fetch the status (e.g., 'unpaid', 'paid')
        //                 userEmail,
        //             });
        //         });
        
        //         return transactions; // Return the fetched transactions
        //     } catch (error) {
        //         console.error('Error fetching transactions:', error);
        //         throw error;
        //     }
        // }

        static async updateBalanceStatus(userEmail, transactionId, newStatus) {
            try {
                // Ensure userEmail and transactionId are strings
                if (typeof userEmail !== 'string' || typeof transactionId !== 'string') {
                    throw new TypeError('User email and transaction ID must be strings');
                }
        
                const balanceDocPath = `Balance/${userEmail}/transactions`; // Path to transactions sub-collection
                const docRef = FService.getDocRef(balanceDocPath, transactionId); // Get a reference to the specific transaction
        
                // Check if the document for the transaction exists
                const docSnap = await getDoc(docRef);
        
                if (!docSnap.exists()) {
                    console.error(`No transaction found at ${balanceDocPath}/${transactionId}.`);
                    // Handle the case where the transaction does not exist
                    throw new Error(`No transaction found at ${balanceDocPath}/${transactionId}.`);
                } else {
                    // Proceed to update the status of the specific transaction
                    await FService.updateDocument(balanceDocPath, transactionId, { status: newStatus });
                    console.log("Transaction status updated successfully.");
                }
            } catch (error) {
                console.error("Error updating transaction status:", error);
                throw error;
            }
        }

        static async fetchTransactions(userEmail) {
            try {
                const balanceCollectionPath = `Balance/${userEmail}/transactions`;
                const querySnapshot = await FService.getDocuments(balanceCollectionPath);
                const transactions = [];
    
                querySnapshot.forEach((doc) => {
                    const transactionData = doc.data();
                    transactions.push({
                        id: doc.id,  // Include document ID for reference
                        remainingBalance: transactionData.remainingBalance,  // Ensure this is fetched
                        createdDate: transactionData.createdDate,   // Fetch the transaction's created date
                        status: transactionData.status,             // Fetch the status (e.g., 'unpaid', 'paid')
                        userEmail, // Include the user email for reference
                    });
                });
    
                return transactions; // Return the fetched transactions
            } catch (error) {
                console.error('Error fetching transactions:', error);
                throw error;
            }
        }
    

    

        static generateReferenceNumber() {
            return Math.floor(Math.random() * 1000000000).toString();
        }

}

export default OrderController;
