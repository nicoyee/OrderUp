import User from '../User';
import AdminController from '../controllers/AdminController';

class Admin extends User {
    constructor(name, email, profilePicture) {
        super(name, email, 'admin', profilePicture);
    }
    
    //CUD Dish
    static async createDish(name, menuType, description, price, photo) {
        return await AdminController.Dishes.add(name, menuType, description, price, photo);
    }

    static async deleteDish(id) {
        return await AdminController.Dishes.remove(id);
    }

    static async editDish(id, newData) {
        return await AdminController.Dishes.update(id, newData);
    }

    //CRUD User
    static async fetchUsers() {
        return await AdminController.Users.fetch();
    }   

    static async banUser(userId) {
        return await AdminController.Users.ban(userId);
    }

    static async signUpStaff(name, email, password, userType) {
        return await AdminController.Users.addStaff(name, email, password, userType);
    }

    //CRUD Event
    static async createEvent(eventName, description, location, status, date, socialLink, photo) {
        return await AdminController.Events.create(eventName, description, location, status, date, socialLink, photo);
    }

    static async fetchEvents() {
        return await AdminController.Events.fetch();
    }

    static async updateEvent(eventId, eventData) {
        return await AdminController.Events.update(eventId, eventData);
    }

    static async deleteEvent(eventId) {
        return await AdminController.Events.delete(eventId);
    }

    //Order Management
    static async fetchOrderHistory(userId) {
        return await AdminController.Orders.viewHistory(userId);
    }

    // get all customer orders
    static async getCustomerOrders(){

    }

    // orderStatus: create an enum for OrderStatus
    // Order Processed, 
    // Downpayment Paid,
    // Full Payment Paid,
    // Delivered
    // Completed
    static async updateCustomerOrderStatus(userId, orderStatus){

    }
}

export default Admin;
