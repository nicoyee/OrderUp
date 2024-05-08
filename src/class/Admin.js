import User from './User';
import { Dish, MeatDish, VegetarianDish, DessertDish, SeafoodDish } from './Dish';

class Admin extends User {
    constructor(name, email, profilePicture) {
        super(name, email, 'admin', profilePicture);
    }

    static createDish(name, menuType, description, price, photo) {
        switch (menuType) {
            case 'Meat':
                return new MeatDish(name, description, price, photo);
            case 'Vegetarian':
                return new VegetarianDish(name, description, price, photo);
            case 'Dessert':
                return new DessertDish(name, description, price, photo);
            case 'Seafood':
                return new SeafoodDish(name, description, price, photo);
            default:
                throw new Error('Invalid menu type');
        }
    }

    static async deleteDish(id) {
        try {
            const dish = await Dish.getById(id);
            await dish.delete();
            console.log('Dish deleted successfully');
        } catch (error) {
            console.error('Error deleting dish:', error);
            throw error;
        }
    }
}

export default Admin;
