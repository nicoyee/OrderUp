import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

class User {
    constructor(name, email, password) {
        this.name = name;
        this.email = email;
        this.password = password;

        this.uid = null;
        this.profilePicture = null;
        this.userType = null;
    }

    signUp() {
        const auth = getAuth();
    }

}