import User from './User';
import Firebase from './firebase.ts';

class AuthService {
    static signUp(name, email, password, userType) {
        const firebase = Firebase.getInstance();
        firebase.createUserWithEmailAndPass(name, email, password, userType);
    }
    

    static logIn(email, password) {
        const firebase = Firebase.getInstance();
        return firebase.signInWithEmailAndPass(email, password);
    }

    static resetPass(email) {
        const firebase = Firebase.getInstance();
        return firebase.sendPasswordReset(email);
    }


    static signOut() {
        const firebase = Firebase.getInstance();
        return firebase.signOut(firebase.auth);
    }
}

export default AuthService;
