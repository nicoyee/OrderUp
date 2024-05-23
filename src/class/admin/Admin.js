import User from '../User';
import { Dish, MeatDish, VegetarianDish, DessertDish, SeafoodDish } from '../Dish';
import { doc, deleteDoc, updateDoc, getDocs, collection, setDoc, addDoc } from 'firebase/firestore';

import { MenuType } from '../../constants';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

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

    static async fetchOrderHistory(userId) {
        try {
            const querySnapshot = await getDocs(collection(firebaseInstance.db, 'checkouts'));
            const orders = [];
            querySnapshot.forEach((doc) => {
                const orderData = { id: doc.id, ...doc.data() };
                if (orderData.userId === userId) {
                    orders.push(orderData);
                }
            });
            return orders;
        } catch (error) {
            console.error('Error fetching order history:', error);
            throw error;
        }
    }

    static async signUpStaff(name, email, password, userType) {

        try {

            // Create the user account with email and password
            const userCredential = await this.signUp(firebaseInstance.auth, email, password);

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

    static async createEvent(eventName, description, location, status, date, socialLink, photo) {
        try {
            let photoURL = '';
            if (photo) {
                const storageRef = ref(firebaseInstance.storage, `events/${photo.name}`);
                await uploadBytes(storageRef, photo);
                photoURL = await getDownloadURL(storageRef);
            }
            const newEvent = {
                eventName,
                description,
                location,
                status,
                date: date.toISOString(),
                socialLink,
                photoURL
            };
            const docRef = await addDoc(collection(firebaseInstance.db, 'events'), newEvent);
            return { id: docRef.id, ...newEvent };
        } catch (error) {
            console.error('Error creating event:', error);
            throw error;
        }
    }

    static async fetchEvents() {
        try {
            const eventCollection = collection(firebaseInstance.db, 'events');
            const eventSnapshot = await getDocs(eventCollection);
            const eventList = eventSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            return eventList;
        } catch (error) {
            console.error('Error fetching events:', error);
            throw error;
        }
    }

    static async updateEvent(eventId, eventData) {
        try {
            let photoURL = eventData.photoURL;
            if (eventData.photo && typeof eventData.photo !== 'string') {
                const storageRef = ref(firebaseInstance.storage, `events/${eventData.photo.name}`);
                await uploadBytes(storageRef, eventData.photo);
                photoURL = await getDownloadURL(storageRef);
            }
            const updatedEvent = {
                ...eventData,
                photoURL
            };
            await updateDoc(doc(firebaseInstance.db, 'events', eventId), updatedEvent);
            return updatedEvent;
        } catch (error) {
            console.error('Error updating event:', error);
            throw error;
        }
    }

    static async deleteEvent(eventId) {
        try {
            await deleteDoc(doc(firebaseInstance.db, 'events', eventId));
            console.log('Event deleted successfully');
        } catch (error) {
            console.error('Error deleting event:', error);
            throw error;
        }
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
