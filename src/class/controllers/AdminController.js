import { doc, deleteDoc, updateDoc, getDocs, collection, setDoc, addDoc } from 'firebase/firestore';
import { db , storage} from '../../firebase.js';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { Dish } from '../Dish.js';
import { FController } from "./controller.ts";


class AdminController{
    static Dishes = {
        async add(name, menuType, description, price, photo) {
            // Create Dish instance based on the menuType
            let dish = new Dish(name, menuType, description, price, photo);

            // Upload photo to storage and get photoURL
            const photoURL = await AdminController.uploadPhoto(dish.photo, 'dishes');

            // Create new dish object with photoURL
            const newDish = {   
                name: dish.name, 
                description: dish.description, 
                price: dish.price, 
                menuType: dish.menuType,
                photoURL
            };

            // Add new dish document to Firestore
            return await AdminController.addDocument('dishes', newDish);
        },

        async remove(id) {
            try {
                await deleteDoc(doc(db, 'dishes', id));
                console.log('Dish deleted successfully');
            } catch (error) {
                console.error('Error deleting dish:', error);
                throw error;
            }
        },

        async update(id, newData) {
            try {
                await updateDoc(doc(db, 'dishes', id), newData);
                console.log('Dish updated successfully');
            } catch (error) {
                console.error('Error updating dish:', error);
                throw error;
            }
        }
    }

    static Users ={
        async fetch() {
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
        },

        async ban(userId) {
            try {
                await deleteDoc(doc(db, 'users', userId));
                console.log('User banned successfully');
            } catch (error) {
                console.error('Error banning user:', error);
                throw error;
            }
        },

        async addStaff(name, email, password, userType) {
            try {
                const firebase = FController();
    
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
                    userType: 'staff',
                    uid: user.uid,
                    profilePicture: ''
                });
    
                console.log('Staff added successfully:', user);
                return user;
            } catch (error) {
                if (error.code === 'auth/email-already-in-use') {
                    console.error('Error: The email address is already in use.');
                    alert('The email address is already in use. Please try another email.');
                } else {
                    console.error('Error signing up user:', error);
                }
                throw error;
            }
        }
    }

    static Events = {
        async create(eventName, description, location, status, date, socialLink, photo) {
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
                console.log('Event created successfully:', { id: docRef.id, ...newEvent });
                return { id: docRef.id, ...newEvent };
            } catch (error) {
                console.error('Error creating event:', error);
                throw error;
            }
        },

        async fetch() {
            try {
                const eventCollection = collection(db, 'events');
                const eventSnapshot = await getDocs(eventCollection);
                const eventList = eventSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                return eventList;
            } catch (error) {
                console.error('Error fetching events:', error);
                throw error;
            }
        },

        async update(eventId, eventData) {
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
                console.log('Event updated successfully:', updatedEvent);
                return updatedEvent;
            } catch (error) {
                console.error('Error updating event:', error);
                throw error;
            }
        },

        async delete(eventId) {
            try {
                // Delete event document from Firestore
                await deleteDoc(doc(db, 'events', eventId));
                console.log('Event deleted successfully');
            } catch (error) {
                console.error('Error deleting event:', error);
                throw error;
            }
        }
    }

    static Orders = {
        async viewHistory(user) {
            try {
                // Construct the path to the user's orders collection
                const ordersCollectionPath = `Orders/${user}/orders`;
                const ordersCollectionRef = collection(db, ordersCollectionPath);

                // Fetch the orders from the specified path
                const querySnapshot = await getDocs(ordersCollectionRef);
                const orders = [];
                querySnapshot.forEach((doc) => {
                    orders.push({ id: doc.id, ...doc.data() });
                });

                console.log('Filtered orders for user:', orders); // Add logging
                return orders;
            } catch (error) {
                console.error('Error fetching order history:', error);
                throw error;
            }
        },

        async getOrders(){

        },
    
        // orderStatus: create an enum for OrderStatus
        // Order Processed, 
        // Downpayment Paid,
        // Full Payment Paid,
        // Delivered
        // Completed
        async updateStatus(orderId, newStatus){
            try {
                // Reference to the specific order document
                const orderRef = doc(db, 'checkouts', orderId);

                // Update the status field in the order document
                await updateDoc(orderRef, {
                    status: newStatus
            });

            console.log("Order status updated successfully.");
        } catch (error) {
            console.error("Error updating order status:", error);
            throw error;
        }
     }
    };

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