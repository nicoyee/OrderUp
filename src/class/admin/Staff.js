import DishController from '../controllers/DishController';
import OrderController from '../controllers/OrderController';
import EventsController from '../controllers/EventsController';
import User from '../User';

class Staff extends User {
    constructor(name, email, profilePicture) {
        super(name, email, 'staff', profilePicture);
    }
    
    //Dish
    static async createDish(name, menuType, description, price, photo) {
        return await DishController.add(name, menuType, description, price, photo);
    }

    static async editDish(id, newData) {
        return await DishController.update(id, newData);
    }
    // Events
    static async fetchEvents() {
        return await EventsController.fetch();
    }

    static async updateEvent(eventId, eventData) {
        return await EventsController.update(eventId, eventData);
    }

    // Order Management
    static async fetchOrderHistory(userEmail) {
        return await OrderController.viewHistory(userEmail);
    }

    static async updateCustomerOrderStatus(orderId, documentId, newStatus) {
        return await OrderController.updateStatus(orderId, documentId, newStatus);
    }
    
    static async fetchBalances(userEmail){
        return await OrderController.fetch(userEmail);
    }

    static async getUserTransactions(userEmail) {
        return await OrderController.fetchTransactions(userEmail);
    }

    static async fetchCancellationRequests() {
        return await OrderController.fetchCancellationRequests();
    }

    static async fetchRefundRequests() {
        return await OrderController.fetchRefundRequests();
    }

    static async approveCancellation(requestId) {
        return await OrderController.confirmCancellation(requestId);
    }

    static async approveRefund(requestId) {
        return await OrderController.confirmRefund(requestId);
    }

    static async rejectCancellation(requestId) {
        return await OrderController.rejectCancellation(requestId);
    }

    static async rejectRefund(requestId) {
        return await OrderController.rejectRefund(requestId);
    }
}

export default Staff;
