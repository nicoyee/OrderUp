import { auth } from "../firebase";
import { getAuth,   createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, signOut } from "firebase/auth";
import User from './User';

class AuthService {
    static signUp(name, email, password) {
        return createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                return new User(user.uid, name, email, 'customer', ''); // Assuming 'customer' is the default userType
            })
            .catch((error) => {
                throw error;
            });
    }

    static logIn(email, password) {
        return signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                return new User(user.uid, user.displayName || '', email, 'customer', ''); // Adjust as needed
            })
            .catch((error) => {
                throw error;
            });
    }

    static sendPasswordResetEmail(email) {
        return sendPasswordResetEmail(auth, email)
            .then(() => {
                console.log('Password reset email sent!');
            })
            .catch((error) => {
                throw error;
            });
    }

    static signOut() {
        const auths = getAuth();
        return signOut(auths)
            .then(() => {
                console.log('User signed out');
            })
            .catch((error) => {
                console.error('Error signing out', error);
                throw error;
            });
    }
}

export default AuthService;