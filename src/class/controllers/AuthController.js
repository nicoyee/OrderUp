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
            const userCredential = await signInWithEmailAndPassword(FService.auth, email, password);
            return userCredential.user;
        } catch (error) {
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