

import { firebaseInstance } from "./firebase.ts";

class User {
    constructor(docId, name, email, userType, profilePicture) {
        this.docId = docId;
        this.name = name;
        this.email = email;
        this.userType = userType;
        this.profilePicture = profilePicture;
    }
    
    //Common functions
    //Dishes
    static async getDishes(){        
        return firebaseInstance.getDocuments('dishes');
    }

    // Auth
    static signUp(name, email, password, userType) {
        return firebaseInstance.createUserWithEmailAndPass(name, email, password, userType);
    }
    

    static logIn(email, password) {
        return firebaseInstance.signInWithEmailAndPass(email, password);
    }

    static resetPass(email) {
        return firebaseInstance.sendPasswordReset(email);
    }


    static signOut() {
        return firebaseInstance.signOut(firebaseInstance.auth);
    }
}

export default User;
