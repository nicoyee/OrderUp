import { FService } from "./FirebaseService.ts";
import { Order } from "../Order.ts";

class OrderController {
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
                    order.createdBy = orderData.createdBy || docRef.id;
                    order.createdDate = orderData.createdDate;
                    order.items = orderData.items;
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

    static async getOrderDetails(documentId, orderId) {
        try {
            const orderDoc = await FService.getDocument(`Orders/${documentId}/orders`, orderId);
            if (orderDoc.exists()) {
                const orderData = orderDoc.data();
                const order = new Order();
                order.createdBy = orderData.createdBy;
                order.createdDate = orderData.createdDate;
                order.items = orderData.items;
                return order;
            } else {
                throw new Error("Order not found");
            }
        } catch (error) {
            console.error("Error fetching order details:", error);
            throw error;
        }
    }

    static async createOrder(email, cartData) {
        try {
            const referenceNumber = cartData.referenceNumber;
            if (!referenceNumber) {
                throw new Error('Reference number is missing in cartData');
            }
            await FService.setDocument(`Orders/${email}/orders`, referenceNumber, cartData);
        } catch (error) {
            throw error;
        }
    }

    static async uploadSlip(slip) {
        // Implement slip upload logic if needed
    }

    static async viewHistory(user) {
        try {
            const ordersCollectionPath = `Orders/${user}/orders`;
            const ordersCollectionRef = FService.getDocuments(ordersCollectionPath);
            const querySnapshot = await FService.getDocuments(ordersCollectionRef);
            const orders = [];
            querySnapshot.forEach((doc) => {
                const orderData = doc.data();
                const order = new Order();
                order.createdBy = orderData.createdBy;
                order.createdDate = orderData.createdDate;
                order.items = orderData.items;
                orders.push(order);
            });

            console.log('Filtered orders for user:', orders);
            return orders;
        } catch (error) {
            console.error('Error fetching order history:', error);
            throw error;
        }
    }

    static async updateStatus(orderId, documentId, newStatus) {
        try {
            await FService.updateDocument(`Orders/${documentId}/orders`, orderId, { status: newStatus });
            console.log("Order status updated successfully.");
        } catch (error) {
            console.error("Error updating order status:", error);
            throw error;
        }
    }  
}

export default OrderController;