import User from '../User';
import { Dish, MeatDish, VegetarianDish, DessertDish, SeafoodDish } from '../Dish';
import { doc, deleteDoc, updateDoc, getDocs, collection, setDoc, addDoc } from 'firebase/firestore';

import { firebaseInstance } from "../firebase.ts"

class Admin extends User {
    constructor(name, email, profilePicture) {
        super(name, email, 'admin', profilePicture);
    }
}
export default Admin;
