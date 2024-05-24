import { doc, deleteDoc, updateDoc, getDocs, collection, setDoc, addDoc } from 'firebase/firestore';
import { db , storage} from '../../firebase';
import Firebase from "../firebase.ts";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { MenuType } from '../../constants';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { MeatDish, VegetarianDish, DessertDish, SeafoodDish } from '../Dish.js';

class AdminController {
    static async createDish(name, menuType, description, price, photo) {
        // Create Dish instance based on the menuType
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

        // Upload photo to storage and get photoURL
        const photoURL = await this.uploadPhoto(dish.photo, 'dishes');

        // Create new dish object with photoURL
        const newDish = {   
            name: dish.name, 
            description: dish.description, 
            price: dish.price, 
            menuType: dish.menuType,
            photoURL
        }

        // Add new dish document to Firestore
        return await this.addDocument('dishes', newDish);
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
            await updateDoc(doc(db, 'dishes', id), newData);
            console.log('Dish updated successfully');
        } catch (error) {
            console.error('Error updating dish:', error);
            throw error;
        }
    }

    static async fetchUsers() {
        // Fetch users collection from Firestore
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

    static async fetchOrderHistory(userId) {
        try {
            // Fetch checkouts collection from Firestore
            const querySnapshot = await getDocs(collection(db, 'checkouts'));
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

    static async createEvent(eventName, description, location, status, date, socialLink, photo) {
        try {
            let photoURL = '';
            if (photo) {
                const storageRef = ref(storage, `events/${photo.name}`);
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
            // Add new event document to Firestore
            const docRef = await addDoc(collection(db, 'events'), newEvent);
            return { id: docRef.id, ...newEvent };
        } catch (error) {
            console.error('Error creating event:', error);
            throw error;
        }
    }

    static async fetchEvents() {
        try {
            const eventCollection = collection(db, 'events');
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
                const storageRef = ref(storage, `events/${eventData.photo.name}`);
                await uploadBytes(storageRef, eventData.photo);
                photoURL = await getDownloadURL(storageRef);
            }
            const updatedEvent = {
                ...eventData,
                photoURL
            };
            // Update event document in Firestore
            await updateDoc(doc(db, 'events', eventId), updatedEvent);
            return updatedEvent;
        } catch (error) {
            console.error('Error updating event:', error);
            throw error;
        }
    }

    static async deleteEvent(eventId) {
        try {
            // Delete event document from Firestore
            await deleteDoc(doc(db, 'events', eventId));
            console.log('Event deleted successfully');
        } catch (error) {
            console.error('Error deleting event:', error);
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

    // Helper function to upload photo to storage
    static async uploadPhoto(photo, folder) {
        try {
            if (!photo) return ''; // If no photo, return empty string

            const storageRef = ref(storage, `${folder}/${photo.name}`);
            await uploadBytes(storageRef, photo);
            return await getDownloadURL(storageRef);
        } catch (error) {
            console.error('Error uploading photo:', error);
            throw error;
        }
    }

    // Helper function to add document to Firestore
    static async addDocument(collectionName, data) {
        try {
            const docRef = await addDoc(collection(db, collectionName), data);
            return { id: docRef.id, ...data };
        } catch (error) {
            console.error('Error adding document:', error);
            throw error;
        }
    }
}


export default AdminController;
