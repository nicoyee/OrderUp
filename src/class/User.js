import { firebaseInstance } from "./firebase.ts";

class User {
    constructor(docId = "", name ="", email="", userType="", profilePicture="") {
        this.docId = docId;
        this.name = name;
        this.email = email;
        this.userType = userType;
        this.profilePicture = profilePicture;
    }
    
    setUserDetails(docId, name, email, userType, profilePicture){
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
    signUp(name, email, password, userType) {
        return firebaseInstance.createUserWithEmailAndPass(name, email, password, userType);
    }
    

    logIn(email, password) {
        return firebaseInstance.signInWithEmailAndPass(email, password);
    }

    resetPass(email) {
        return firebaseInstance.sendPasswordReset(email);
    }


    signOut() {
        return firebaseInstance.signOut(firebaseInstance.auth);
    }
}

export default User;
const userInstance = new User()
export { userInstance }