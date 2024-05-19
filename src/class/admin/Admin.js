import User from '../User';
import { Dish, MeatDish, VegetarianDish, DessertDish, SeafoodDish } from '../Dish';
import { doc, deleteDoc, updateDoc, getDocs, collection, setDoc } from 'firebase/firestore';
import  {db}  from '../../firebase';
import { MenuType } from '../../constants';
import Firebase from "../firebase.ts"
import AuthService from '../AuthService.js';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

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

    static async fetchUsers() {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const usersData = [];
        querySnapshot.forEach((doc) => {
            const userData = { id: doc.id, ...doc.data() };
            if (userData.userType !== 'admin') {
                usersData.push(userData);
            }
        });
        // Sort users by userType (staff first, customers last)
        usersData.sort((a, b) => {
            if (a.userType === 'staff' && b.userType !== 'staff') return -1;
            if (a.userType !== 'staff' && b.userType === 'staff') return 1;
            return 0;
        });
        return usersData;
    }

    static async banUser(userId) {
        try {
            await deleteDoc(doc(db, 'users', userId));
            console.log('User banned successfully');
        } catch (error) {
            console.error('Error banning user:', error);
            throw error;
        }
    }

    static async signUp(name, email, password, userType) {
        try {
            const firebase = Firebase.getInstance();

            // Create the user account with email and password
            const userCredential = await createUserWithEmailAndPassword(firebase.auth, email, password);

            // Access the created user object
            const user = userCredential.user;

            // Update the user profile with the provided name
            await updateProfile(user, {
                displayName: name
            });

            // Save user information including userType in Firestore
            await setDoc(doc(firebase.db, 'users', user.uid), {
                name,
                email,
                userType,
                uid: user.uid,
                profilePicture: ''
            });

            // Return the user
            return user;
        } catch (error) {
            console.error('Error signing up user:', error);
            throw error;
        }
    }
}

export default Admin;
