import { Dish } from '../Dish.js';
import { FService } from './FirebaseService.ts';
import { doc, setDoc } from 'firebase/firestore';

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
            await setDoc(doc(FService.db, 'dishes', id), {
                deleted: true
            }, { merge: true });
            console.log('Dish marked as deleted successfully');
        } catch (error) {
            console.error('Error marking dish as deleted:', error);
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

    static async uploadDishPhoto(photo) {
        try {
            const photoURL = await FService.uploadPhoto(photo, 'dishes');
            return photoURL;
        } catch (error) {
            console.error('Error uploading dish photo:', error);
            throw error;
        }
    }
}

export default DishController;