import DishController from '../controllers/DishController';
import OrderController from '../controllers/OrderController';
import User from '../User';

class Staff extends User {
    constructor(name, email, profilePicture) {
        super(name, email, 'admin', profilePicture);
    }
    
    // CUD Dish
    static async createDish(name, menuType, description, price, photo) {
        return await DishController.add(name, menuType, description, price, photo);
    }

    static async deleteDish(id) {
        return await DishController.remove(id);
    }

    static async editDish(id, newData) {
        return await DishController.update(id, newData);
    }

    // Order Management
    static async fetchOrderHistory(user) {
        return await OrderController.viewHistory(user);
    }

    static async getCustomerOrders() {
        return await OrderController.getOrders();
    }
    
    static async updateCustomerOrderStatus(orderId, documentId, newStatus) {
        return await OrderController.updateStatus(orderId, documentId, newStatus);
    }

    static async getOrderDetails(documentId, orderId) {
        return await OrderController.getOrderDetails(documentId, orderId);
    }
}

export default Staff;
