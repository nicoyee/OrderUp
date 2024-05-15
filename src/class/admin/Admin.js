import User from '../User';
import { Dish, MeatDish, VegetarianDish, DessertDish, SeafoodDish } from '../Dish';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import  {db}  from '../../firebase';
import { MenuType } from '../../constants';

class Admin extends User {
    constructor(name, email, profilePicture) {
        super(name, email, 'admin', profilePicture);
    }

    static createDish(name, menuType, description, price, photo) {
        switch (menuType) {
            case MenuType.MEAT:
                return new MeatDish(name, description, price, photo);
            case MenuType.VEGETARIAN:
                return new VegetarianDish(name, description, price, photo);
            case MenuType.DESSERT:
                return new DessertDish(name, description, price, photo);
            case MenuType.SEAFOOD:
                return new SeafoodDish(name, description, price, photo);
            default:
                throw new Error('Invalid menu type');
        }
    }

    static async deleteDish(id) {
        try {
          await deleteDoc(doc(db, 'dishes', id));
          console.log('Dish deleted successfully');
        } catch (error) {
          console.error('Error deleting dish:', error);
          throw error;
        }
    }

    static async updateDish(id, newData) {
        try {
          const dishDocRef = doc(db, 'dishes', id);
          await updateDoc(dishDocRef, newData);
          console.log('Dish updated successfully');
        } catch (error) {
          console.error('Error updating dish:', error);
          throw error;
        }
    }
}

export default Admin;
