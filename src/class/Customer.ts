import { FController } from "./controllers/controller.ts";
import CustomerController from "./controllers/CustomerController.js";
import User from "./User";

class Customer extends User{

    // TODO: Implement CRUD operations for orders
    static async addToCart(dishId) {
        return await CustomerController.Cart.add(dishId);
    }

    static async persistDeletedCartItems(updatedCartItems) {
        await CustomerController.Cart.deleteItem(updatedCartItems);
    }
    
    static async persistCartItemQuantity(dishId, newQuantity) {
        await CustomerController.Cart.quantity(dishId, newQuantity);
    }

    // order history of customers
    static async getOrders(){
      await CustomerController.Order.get();
    }

    static async createOrder(){
      await CustomerController.Order.create();
    }

    static async uploadOrderTransactionSlip(){
      await CustomerController.Order.uploadSlip();
    }
}

export default Customer;