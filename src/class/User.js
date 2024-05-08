import { auth } from "../firebase.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, signOut } from "firebase/auth";

class User {
    constructor(name, email, userType, profilePicture) {
        this.name = name;
        this.email = email;
        this.userType = userType;
        this.profilePicture = profilePicture;
    }

    static async signUp(name, email, password) {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Add logic to set profile picture and other details as needed
            return new User(name, email, 'customer', '');
        } catch (error) {
            throw error;
        }
    }

    static async logIn(email, password) {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Fetch additional user details if needed
            // For example, you can fetch user profile picture here

            return new User(user.displayName, user.email, 'customer', ''); // Assuming user has displayName
        } catch (error) {
            throw error;
        }
    }

    static async sendPasswordResetEmail(email) {
        try {
            await sendPasswordResetEmail(auth, email);
            console.log('Password reset email sent!');
        } catch (error) {
            throw error;
        }
    }

    static async signOut() {
        try {
            await signOut(auth);
            console.log('User signed out');
        } catch (error) {
            console.error('Error signing out', error);
            throw error;
        }
    }
}

export default User;