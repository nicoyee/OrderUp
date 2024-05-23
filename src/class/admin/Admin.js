import User from '../User';
import { Dish } from '../Dish';
import { firebaseInstance } from "../firebase.ts"

class Admin extends User {
    constructor(name, email, profilePicture) {
        super(name, email, 'admin', profilePicture);
    }

    static async createDish(name, menuType, description, price, photo) {
        let dish = new Dish(name, menuType, description, price, photo);

        console.log("dish", dish)
        const photoURL = await firebaseInstance.uploadPhoto(dish.photo, 'dishes')
        console.log("photoURL", photoURL)

        const newDish = {   
            name: dish.name, 
            description: dish.description, 
            price: dish.price, 
            menuType: dish.menuType,
            photoURL
        }

        return await firebaseInstance.addDocument(
                'dishes', 
                newDish)
            .then((res)=>{
                console.log("Successfully added dish.")
                return newDish
            })
            .catch((err)=>{
                console.log(JSON.stringify(err))
            })
    }
    
    static async deleteDish(id) {
        return firebaseInstance.deleteDocument('dishes', id)
            .then(() => {
                console.log('Dish deleted successfully');
            })
            .catch(error => {
                console.error('Error deleting dish:', error);
                throw error;
            });
    }
    

    static async updateDish(id, newData) {
        return firebaseInstance.updateDocument('dishes', id, newData)
        .then(() => {
            console.log('Dish updated successfully');
        })
        .catch(error =>{
            console.error('Error updating dish:', error);
            throw error;
        });
    }

    static async fetchUsers() {
        const querySnapshot = await firebaseInstance.getDocuments('users');
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
            await firebaseInstance.deleteDocument('users',userId);
            console.log('User banned successfully');
        } catch (error) {
            console.error('Error banning user:', error);
            throw error;
        }
    }

    static async signUpStaff(name, email, password, userType) {
        try {

            // Create the user account with email and password
            const userCredential = await User.signUp(firebaseInstance.auth, email, password);

            // Access the created user object
            const user = userCredential.user;

            await firebaseInstance.setDocument('users')

            // Return the user
            return user;
        } catch (error) {
            console.error('Error signing up user:', error);
            throw error;
        }
    }
}

export default Admin;
