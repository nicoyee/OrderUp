import { doc, setDoc, deleteDoc} from 'firebase/firestore';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { FService } from "./FirebaseService.ts";
import OrderController from './OrderController.js';

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
            await FService.deleteDocument('users', userId);
            console.log('User banned successfully');
        } catch (error) {
            console.error('Error banning user:', error);
            throw error;
        }
    }

    static async addStaff(name, email, password, userType) {
        try {
            // Create the user account with email and password
            const userCredential = await createUserWithEmailAndPassword(FService.auth, email, password);
            const user = userCredential.user;

            // Update the user profile with the provided name
            await updateProfile(user, {
                displayName: name
            });

            // Save user information in Firestore
            await setDoc(doc(FService.db, 'users', user.uid), {
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

    static async fetchCancellationRequests() {
        const querySnapshot = await FService.getDocuments('cancellationRequests');
        const requests = [];
        querySnapshot.forEach((doc) => {
            requests.push({ id: doc.id, ...doc.data() });
        });
        return requests;
    }

    static async confirmCancellation(requestId) {
        await OrderController.updateOrderStatus(requestId, 'canceled');
        await deleteDoc(doc(FService().db, 'cancellationRequests', requestId));
    }

    static async rejectCancellation(requestId) {
        await deleteDoc(doc(FService().db, 'cancellationRequests', requestId));
    }

}


export default AdminController;