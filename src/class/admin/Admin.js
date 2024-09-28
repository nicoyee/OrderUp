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
        return await AdminController.fetch();
    }

    static async banUser(userId) {
        return await AdminController.ban(userId);
    }

    static async signUpStaff(name, email, password, userType) {
        return await AdminController.addStaff(name, email, password, userType);
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
    static async fetchOrderHistory(userEmail) {
        return await OrderController.viewHistory(userEmail);
    }

    static async updateCustomerOrderStatus(userEmail, referenceNumber, newStatus) {
        return await OrderController.updateStatus(userEmail, referenceNumber, newStatus);
    }

    // Fetch all balances
    static async fetchBalances(userEmail){
        return await OrderController.fetch(userEmail);
    }

    // Fetch transactions for a specific user
    static async getUserTransactions(userEmail) {
        return await OrderController.fetchUserTransactions(userEmail);
    }


}

export default Admin;
