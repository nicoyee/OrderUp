import { FService } from "./FirebaseService.ts";
import { Order } from "../Order.ts";

class OrderController {
    
    static async createOrder(orderDetails) {
    try {
        const { email, receiverName, contactNo, address, paymentOption, items, totalAmount } = orderDetails;
        const referenceNumber = this.generateReferenceNumber();
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

        await FService.setDocument(`Orders/${email}/orders`, referenceNumber, orderData);
        console.log("Order created successfully.");
    } catch (error) {
        console.error("Error creating order:", error);
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
                    userEmail,userEmail
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
