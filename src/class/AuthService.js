import User from './User';
import Firebase from './firebase.ts';

class AuthService {
    static signUp(name, email, password) {
        const firebase = Firebase.getInstance();
        firebase.signUp(name, email, password);
    }

    static logIn(email, password) {
        const firebase = Firebase.getInstance();
        return firebase.logIn(email, password);
    }

    static resetPass(email) {
        const firebase = Firebase.getInstance();
        return firebase.resetPassword(email);
    }


    static signOut() {
        const firebase = Firebase.getInstance();
        return firebase.signOut(firebase.auth);
    }
}

export default AuthService;
