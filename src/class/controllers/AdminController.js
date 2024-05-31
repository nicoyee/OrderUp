import { doc, deleteDoc, updateDoc, getDocs, collection, setDoc, addDoc } from 'firebase/firestore';
import { db , storage} from '../../firebase.js';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { Dish } from '../Dish.js';
import { FService } from "./FirebaseService.ts";


class AdminController{
    static async fetch() {
        // Fetch users collection from Firestore
        const querySnapshot = await FService.getDocuments('users');
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

    static async ban(userId) {
        try {
            await FService.deleteDocument('users', 'userId');
            console.log('User banned successfully');
        } catch (error) {
            console.error('Error banning user:', error);
            throw error;
        }
    }

    static async addStaff(name, email, password, userType) {
        try {
            const firebase = FService();

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


export default AdminController;