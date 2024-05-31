import DishController from '../controllers/DishController';
import OrderController from '../controllers/OrderController';
import EventsController from '../controllers/EventsController';
import User from '../User';
import AdminController from '../controllers/AdminController';

class Admin extends User {
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

    // CRUD User
    static async fetchUsers() {
        return await AdminController.Users.fetch();
    }

    static async banUser(userId) {
        return await AdminController.Users.ban(userId);
    }

    static async signUpStaff(name, email, password, userType) {
        return await AdminController.Users.addStaff(name, email, password, userType);
    }

    // CRUD Event
    static async createEvent(eventName, description, location, status, date, socialLink, photo) {
        return await EventsController.create(eventName, description, location, status, date, socialLink, photo);
    }

    static async fetchEvents() {
        return await EventsController.fetch();
    }

    static async updateEvent(eventId, eventData) {
        return await EventsController.update(eventId, eventData);
    }

    static async deleteEvent(eventId) {
        return await EventsController.delete(eventId);
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

export default Admin;
