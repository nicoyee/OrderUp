import { FService } from "./FirebaseService.ts";
import { Order } from "../Order.ts";
import { Balance } from "../Balance.ts";
import { doc, getDoc, deleteDoc, updateDoc, getFirestore } from "firebase/firestore";

class OrderController {
            
    static async createOrder(orderDetails) {
        try {
          const { email, receiverName, contactNo, address, paymentOption, items, totalAmount } = orderDetails;
          const referenceNumber = this.generateReferenceNumber();
    
          if (!email) {
            throw new Error("User email is undefined");
          }
    
          // Calculate amountSent and remaining balance based on payment option
          let amountSent = 0;
          let remainingBalance = 0;
    
          if (paymentOption === "downpayment") {
            amountSent = totalAmount * 0.4; // 40% downpayment
            remainingBalance = totalAmount - amountSent;
          } else if (paymentOption === "fullpayment") {
            amountSent = totalAmount; // Full payment (100%)
            remainingBalance = 0;
          }
    
          // Order data to be stored in Firestore
          const orderData = {
            userEmail: email,
            receiverName,
            contactNo,
            address,
            paymentOption,
            items,
            totalAmount,
            amountSent,
            remainingBalance,
            status: "pending", // default status
            createdDate: new Date(),
            referenceNumber: referenceNumber,
          };
    
          // Create Order document in Firestore
          const path = `Orders/${email}/orders`;
          await FService.setDocument(path, referenceNumber, orderData);
    
          // Check if there is a remaining balance
          if (remainingBalance > 0) {
            await this.storeRemainingBalance(email, remainingBalance);
          }
    
          return referenceNumber;
        } catch (error) {
          console.error("Error creating order:", error.message || error);
          throw error;
        }
      }
    
      // Method to store remaining balance in Firestore
      static async storeRemainingBalance(userEmail, remainingBalance) {
        try {
          if (!userEmail) {
            throw new Error("User email is undefined");
          }
    
          const transactionPath = `Balance/${userEmail}/transactions`;
          const referenceNumber = this.generateReferenceNumber();
          const transactionData = {
            remainingBalance,
            status: remainingBalance > 0 ? "unpaid" : "paid",
            createdDate: new Date(),
          };
    
          await FService.setDocument(transactionPath, referenceNumber, transactionData);
        } catch (error) {
          console.error("Error storing balance transaction:", error.message || error);
          throw error;
        }
      }
      
      // Generate a unique reference number (simulating the method)
      static generateReferenceNumber() {
        return Math.random().toString(36).substr(2, 9).toUpperCase();
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

            static async requestCancellation(userEmail, orderReference) {
                try {

                    const orderDocRef = doc(FService.db, `Orders/${userEmail}/orders`, orderReference);
                    const orderDoc = await getDoc(orderDocRef);

                    if (!orderDoc.exists()) {
                        throw new Error(`Order with reference number ${orderReference} not found.`);
                    }

                    const cancellationRequest = {
                        userEmail,
                        referenceNumber: orderReference,
                        createdAt: new Date(),
                        status: "cancellation-requested", 
                    };
        
                    const requestId = this.generateReferenceNumber(); 
                    await FService.setDocument("cancellationRequests", requestId, cancellationRequest);
            
                    console.log("Cancellation request created successfully.");
                    return requestId; 
                } catch (error) {
                    console.error("Error requesting cancellation:", error);
                    throw error; // Rethrow error to handle it in the calling function
                }
            }

            static async requestRefund(userEmail, orderReference) {
                try {
                    const orderDocRef = doc(FService.db, `Orders/${userEmail}/orders`, orderReference);
                    const orderDoc = await getDoc(orderDocRef);

                    if (!orderDoc.exists()) {
                        throw new Error(`Order with reference number ${orderReference} not found.`);
                    }

                    // Proceed to create the refund request if the order exists
                    const refundRequest = {
                        userEmail,
                        referenceNumber: orderReference, // Ensure the referenceNumber is from the Orders table
                        createdAt: new Date(),
                        status: "refund-requested",
                    };

                    const requestId = this.generateReferenceNumber(); // Generate a unique ID for the refund request
                    await FService.setDocument("refundRequests", requestId, refundRequest);

                    console.log("Refund request created successfully.");
                    return requestId;
                } catch (error) {
                    console.error("Error requesting refund:", error);
                    throw error;
                }
            }
        
            static async fetchCancellationRequests() {
                const querySnapshot = await FService.getDocuments('cancellationRequests');
                const requests = [];
                querySnapshot.forEach((doc) => {
                    requests.push({ id: doc.id, ...doc.data() });
                });
                return requests;
            }
        
            static async fetchRefundRequests() {
                const querySnapshot = await FService.getDocuments('refundRequests');
                const requests = [];
                querySnapshot.forEach((doc) => {
                    requests.push({ id: doc.id, ...doc.data() });
                });
                return requests;
            }
            
            static async confirmCancellation(requestId) {
                try {
                    const requestDocRef = doc(FService.db, "cancellationRequests", requestId);
                    const requestData = (await getDoc(requestDocRef)).data();
        
                    if (requestData) {
                        const { userEmail, referenceNumber } = requestData;
        
                        await this.updateStatus(userEmail, referenceNumber, "cancelled");

                        const transactions = await this.fetchTransactions(userEmail);
                        const pendingTransaction = transactions.find(tx => tx.referenceNumber === referenceNumber);

                        if (pendingTransaction) {
                            await this.updateBalanceStatus(userEmail, pendingTransaction.id, "cancelled");
                        }

                        await deleteDoc(requestDocRef);
                        console.log("Cancellation request confirmed and removed.");
                    } else {
                        throw new Error("Cancellation request not found.");
                    }
                } catch (error) {
                    console.error("Error confirming cancellation:", error);
                    throw error;
                }
            }

            static async confirmRefund(requestId) {
                try {
                    const requestDocRef = doc(FService.db, "refundRequests", requestId);
                    const requestData = (await getDoc(requestDocRef)).data();
        
                    if (requestData) {
                        const { userEmail, referenceNumber } = requestData;
                        
                        await this.updateStatus(userEmail, referenceNumber, "refunded");

                        const transactions = await this.fetchTransactions(userEmail);
                        const paidTransaction = transactions.find(tx => tx.referenceNumber === referenceNumber);

                        if (paidTransaction) {
                            await this.updateBalanceStatus(userEmail, paidTransaction.id, "refunded");
                        }
                        
                        await deleteDoc(requestDocRef);
                        console.log("Refund request confirmed and removed.");
                    } else {
                        throw new Error("Refund request not found.");
                    }
                } catch (error) {
                    console.error("Error confirming refund:", error);
                    throw error;
                }
            }
        
            static async rejectCancellation(requestId) {
                try {
                    const requestDocRef = doc(FService.db, "cancellationRequests", requestId);
                    const requestData = (await getDoc(requestDocRef)).data();
        
                    if (requestData) {
                        const { userEmail, referenceNumber } = requestData;
        
                        await this.updateStatus(userEmail, referenceNumber, "pending");
                        await deleteDoc(requestDocRef);
                        console.log("Order cancellation request rejected and order status reverted to pending.");
                    } else {
                        throw new Error("Cancellation request not found.");
                    }
                } catch (error) {
                    console.error("Error rejecting cancellation request:", error);
                    throw error;
                }
            }

            static async rejectRefund(requestId) {
                try {
                    const requestDocRef = doc(FService.db, "refundRequests", requestId);
                    const requestData = (await getDoc(requestDocRef)).data();

                    if (requestData) {
                        const { userEmail, referenceNumber } = requestData;
                        await this.updateStatus(userEmail, referenceNumber, "downpayment-paid");
                        await deleteDoc(requestDocRef);
                        console.log("Refund request rejected and transaction status reverted to paid.");
                    } else {
                        throw new Error("Refund request not found.");
                    }
                } catch (error) {
                    console.error("Error rejecting refund request:", error);
                    throw error;
                }
            }
        

            static generateReferenceNumber() {
                return Math.floor(Math.random() * 1000000000).toString();
            }
        }

    export default OrderController;
