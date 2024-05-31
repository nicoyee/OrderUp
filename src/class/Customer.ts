// Customer.js
import CartController from "./controllers/CartController.js";
import OrderController from "./controllers/OrderController.js";
import User from "./User";
import { FService } from "./controllers/FirebaseService.ts";

class Customer extends User {
    static async addToCart(dishId) {
        return await CartController.add(dishId);
    }

    static async persistDeletedCartItems(updatedCartItems) {
        await CartController.deleteItem(updatedCartItems);
    }
    
    static async persistCartItemQuantity(dishId, newQuantity) {
        await CartController.quantity(dishId, newQuantity);
    }

    static async getOrders() {
        await OrderController.getOrderDetails;
    }

    static async createOrder(email, cartData) {
        if (!cartData.referenceNumber) {
            throw new Error('Reference number is missing in cartData');
        }
        await OrderController.createOrder(email, cartData);
    }

    static async uploadOrderTransactionSlip(slip) {
        await OrderController.uploadSlip(slip);
    }

    static async getGcashQrCode() {
        const gcashDoc = await FService.getDocument('qr_code', 'gcash');
        return gcashDoc.exists() ? gcashDoc.data() : null;
    }
}

export default Customer;
