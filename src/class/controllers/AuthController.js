import { FService } from "./FirebaseService.ts";
import { 
    createUserWithEmailAndPassword, 
    sendPasswordResetEmail, 
    signInWithEmailAndPassword, 
    signOut as firebaseSignOut,
    updateProfile
} from "firebase/auth";
import { doc, setDoc} from "firebase/firestore";


class AuthController {
    static async signUp(name, email, password, userType) {
        try {
            const userCredential = await createUserWithEmailAndPassword(FService.auth, email, password);
            const user = userCredential.user;

            await updateProfile(user, { displayName: name });

            await setDoc(doc(FService.db, 'users', user.uid), {
                name,
                email,
                userType,
                uid: user.uid,
                profilePicture: ''
            });

            return user;
        } catch (error) {
            console.error('Error signing up user:', error);
            throw error;
        }
    }

    static async logIn(email, password) {
        try {
            // Attempt to sign in with email and password
            const userCredential = await signInWithEmailAndPassword(FService.auth, email, password);
            const user = userCredential.user;
    
            // Fetch user document by UID
            const userDoc = await FService.getDocument('users', user.uid);
    
            // Ensure the document exists and contains necessary data
            if (!userDoc.exists()) {
                await firebaseSignOut(FService.auth);  // Immediately log out if no user doc
                throw new Error('User data not found.');
            }
    
            const userData = userDoc.data();
    
            // Check if the user is banned
            if (userData.banned) {
                await firebaseSignOut(FService.auth);  // Log out the banned user
                throw new Error('Your account has been banned.');  // Throw error to handle in UI
            }
    
            return user;  // Return the user object if everything is fine
        } catch (error) {
            // Catch and propagate any errors encountered
            console.error('Error logging in user:', error);
            throw error;
        }
    }
    
    

    static async resetPassword(email) {
        try {
            await sendPasswordResetEmail(FService.auth, email);
            return { success: true };
        } catch (error) {
            console.error('Error resetting password:', error);
            throw error;
        }
    }

    static async signOut() {
        try {
            await firebaseSignOut(FService.auth);
            return { success: true };
        } catch (error) {
            console.error('Error signing out user:', error);
            throw error;
        }
    }
}

export default AuthController;