import { FService } from "./FirebaseService.ts";
import { Order } from "../Order.ts";

class OrderController {
    // Method to create an order based on checkout form data and cart items
    static async createOrder(email, formData, cartItems, totalAmount) {
        try {
            const referenceNumber = this.generateReferenceNumber();
            const orderData = {
                receiverName: formData.receiverName,
                contactNo: formData.contactNo,
                address: formData.address,
                paymentOption: formData.paymentOption,
                items: cartItems, 
                totalAmount: totalAmount,
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
    static async getOrders() {
        try {
            const snapshot = await FService.getDocuments("Orders");
            const allOrders = [];

            for (const docRef of snapshot.docs) {
                const orderIdSnapshot = await FService.getDocuments(`Orders/${docRef.id}/orders`);
                orderIdSnapshot.forEach((orderDoc) => {
                    const orderData = orderDoc.data();
                    const order = new Order();
                    order.orderId = orderDoc.id;
                    order.createdBy = orderData.receiverName || docRef.id;
                    order.createdDate = orderData.createdDate;
                    order.items = orderData.items;
                    order.totalAmount = orderData.totalAmount;
                    order.status = orderData.status || "pending";
                    allOrders.push(order);
                });
            }
            return allOrders;
        } catch (error) {
            console.error("Error fetching orders:", error);
            throw error;
        }
    }

    // Method to fetch specific order details
    static async getOrderDetails(documentId, orderId) {
        try {
            const orderDoc = await FService.getDocument(`Orders/${documentId}/orders`, orderId);
            if (orderDoc.exists()) {
                const orderData = orderDoc.data();
                const order = new Order();
                order.createdBy = orderData.receiverName;
                order.createdDate = orderData.createdDate;
                order.items = orderData.items;
                order.totalAmount = orderData.totalAmount;
                return order;
            } else {
                throw new Error("Order not found");
            }
        } catch (error) {
            console.error("Error fetching order details:", error);
            throw error;
        }
    }

    // Method to view the order history for a specific user
    static async viewHistory(userEmail) {
        try {
            const ordersCollectionPath = `Orders/${userEmail}/orders`;
            const ordersCollectionRef = FService.getDocuments(ordersCollectionPath);
            const querySnapshot = await FService.getDocuments(ordersCollectionRef);
            const orders = [];

            querySnapshot.forEach((doc) => {
                const orderData = doc.data();
                const order = new Order();
                order.createdBy = orderData.receiverName;
                order.createdDate = orderData.createdDate;
                order.items = orderData.items;
                order.totalAmount = orderData.totalAmount;
                orders.push(order);
            });

            console.log("Filtered orders for user:", orders);
            return orders;
        } catch (error) {
            console.error("Error fetching order history:", error);
            throw error;
        }
    }

    // Method to update the order status (e.g., to 'completed', 'shipped', etc.)
    static async updateStatus(orderId, documentId, newStatus) {
        try {
            await FService.updateDocument(`Orders/${documentId}/orders`, orderId, { status: newStatus });
            console.log("Order status updated successfully.");
        } catch (error) {
            console.error("Error updating order status:", error);
            throw error;
        }
    }

    // Utility method to generate a unique reference number
    static generateReferenceNumber() {
        return Math.floor(Math.random() * 1000000000).toString();
    }
}

export default OrderController;
