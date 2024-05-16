import User from '../User';
import { Dish, MeatDish, VegetarianDish, DessertDish, SeafoodDish } from '../Dish';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import  {db}  from '../../firebase';
import { MenuType } from '../../constants';
import { Firebase } from "../firebase.ts"

class Admin extends User {
    constructor(name, email, profilePicture) {
        super(name, email, 'admin', profilePicture);
    }

    static async createDish(name, menuType, description, price, photo) {
        let dish;
        switch (menuType) {
            case MenuType.MEAT:
                dish = new MeatDish(name, description, price, photo);
                break;
            case MenuType.VEGETARIAN:
                dish = new VegetarianDish(name, description, price, photo);
                break;
            case MenuType.DESSERT:
                dish = new DessertDish(name, description, price, photo);
                break;
            case MenuType.SEAFOOD:
                dish = new SeafoodDish(name, description, price, photo);
                break;
            default:
                console.log("Invalid menu type.")
                break;
                
        }

        const firebase = new Firebase()

        console.log("dish", dish)
        const photoURL = await firebase.uploadPhoto(dish.photo, 'dishes')
        console.log("photoURL", photoURL)

        const newDish = {   
            name: dish.name, 
            description: dish.description, 
            price: dish.price, 
            menuType: dish.menuType,
            photoURL
        }

        return await firebase.addDocument(
                'dishes', 
                newDish)
            .then((res)=>{
                console.log("Successfully added dish.")
                return newDish
            })
            .catch((err)=>{
                console.log(JSON.stringify(err))
            })
        // async uploadPhoto() {
        //     try {
        //       if (this.photo) {
        //         const storageRef = ref(storage, `dishes/${this.photo.name}`);
        //         await uploadBytes(storageRef, this.photo);
        //         return getDownloadURL(storageRef);
        //       }
        //       return '';
        //     } catch (error) {
        //       console.error('Error uploading photo:', error);
        //       throw error;
        //     }
        //   }
        
        //   async saveToDatabase() {
              
        //       try {
        //       const photoURL = await this.uploadPhoto();
        //       await addDoc(collection(db, 'dishes'), {
        //           name: this.name,
        //           description: this.description,
        //           price: this.price,
        //           photoURL,
        //           menuType: this.menuType
        //       });
        //       } catch (error) {
        //       console.error('Error saving dish to database:', error);
        //       throw error;
        //       }
        //   }
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
