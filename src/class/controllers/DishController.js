import { Dish } from '../Dish.js';
import { FService } from './FirebaseService.ts';

class DishController {
    static async add(name, menuType, description, price, photo) {
        // Create Dish instance based on the menuType
        let dish = new Dish(name, menuType, description, price, photo);

        // Upload photo to storage and get photoURL
        const photoURL = await FService.uploadPhoto(dish.photo, 'dishes');

        // Create new dish object with photoURL
        const newDish = {   
            name: dish.name, 
            description: dish.description, 
            price: dish.price, 
            menuType: dish.menuType,
            photoURL
        };
        
        return await FService.addDocument('dishes', newDish)
    }

    static async remove(id) {
        try {
            await FService.deleteDocument('dishes', id);
            console.log('Dish deleted successfully');
        } catch (error) {
            console.error('Error deleting dish:', error);
            throw error;
        }
    }

    static async update(id, newData) {
        try {
            await FService.updateDocument('dishes', id, newData);
            console.log('Dish updated successfully');
        } catch (error) {
            console.error('Error updating dish:', error);
            throw error;
        }
    }
}

export default DishController;