import { 
    Auth, 
    createUserWithEmailAndPassword, 
    getAuth, 
    sendPasswordResetEmail, 
    signInWithEmailAndPassword, 
    signOut
} from "firebase/auth";
import { 
    Firestore, 
    collection, 
    doc, 
    getDoc, 
    getFirestore, 
    setDoc,
    addDoc, 
    deleteDoc,
    updateDoc,
    getDocs
} from "firebase/firestore";
import { 
    FirebaseStorage, 
    getStorage,
    ref, 
    uploadBytes, 
    getDownloadURL
} from "firebase/storage";
import { initializeApp } from "firebase/app";
import User, { userInstance }  from "./User";
import { UserType } from "../constants";

interface IFirebase {
    auth: Auth, 
    db: Firestore, 
    storage: FirebaseStorage
}

class Firebase implements IFirebase{
    auth: Auth;
    db: Firestore;
    storage: FirebaseStorage;

    constructor(){
        const app = initializeApp({
            apiKey: "AIzaSyCfI4xkjg99phmVltisyBQahPIQlHMFc-4",
            authDomain: "orderup-14fbd.firebaseapp.com",
            projectId: "orderup-14fbd",
            storageBucket: "orderup-14fbd.appspot.com",
            messagingSenderId: "202358235176",
            appId: "1:202358235176:web:482e1544c3990734bd551d",
            measurementId: "G-KB2290KV8P"
          });

        

        this.auth = getAuth(app);
        this.db = getFirestore(app);
        this.storage = getStorage(app);
    }

    getDocRef(path, identifier){
        return doc(this.db, path, identifier)
    }

    getDocument(path, identifier){
        const docRef = this.getDocRef(path, identifier)
        return getDoc(docRef)
    }

    getDocuments(path){
        return getDocs(collection(this.db, path))
    }

    setDocument(path, identifier, data){
        const docRef = this.getDocRef(path, identifier)
        return setDoc(docRef, data)
    }

    addDocument(path, data){
        console.log("to add", data)
        return addDoc(collection(this.db, path), data)
    }

    deleteDocument(path, identifier){
        const docRef = this.getDocRef(path, identifier)
        return deleteDoc(docRef)
    }

    updateDocument(path, identifier, data){
        const docRef = this.getDocRef(path, identifier)
        return updateDoc(docRef, data)
    }

    getStorageRef(path, fileName){
        return ref(this.storage, `${path}/${fileName}`)
    }
    

    async uploadPhoto(file, path){
        const storageRef = this.getStorageRef(path, file.name)
        return await uploadBytes(storageRef, file)
            .then(async()=>{
                console.log("Uploaded a blob or file!")
                return await getDownloadURL(storageRef)
            })
            .catch((err)=>{
                //TODO: implement proper error handling
                throw(err)
            })
    }

    //AuthService
    async createUserWithEmailAndPass(name, email, password, userType){
        return await createUserWithEmailAndPassword(this.auth, email, password)
            .then(async(userCredential) => {
                const user = userCredential.user;
                const newUserDoc = {
                    name: user.displayName?.split(' ')?.[0] ?? "",
                    email: user.email,
                    userType: userType,
                    profilePicture: user.photoURL,
                  };
                  this.setDocument('users', user.uid, newUserDoc)
                    .then(() => {
                      console.log('User document created');
                    })
            })
            .catch((error) => {
                console.log(error)
            })
    }

    async signInWithEmailAndPass(email, password){
        return await signInWithEmailAndPassword(this.auth, email, password)
            .then( async (userCredential) => {
                console.log("signinwithemailandpass")
                const user = userCredential.user;
                //retrieve user info from user collection
                
                const currentUser = (await this.getDocument('users', user.uid)).data();
                // return new User(currentUser?.uid ?? "", currentUser!.name, currentUser!.email, currentUser!.userType, currentUser!.profilePicture);
                userInstance.setUserDetails(
                    currentUser!.uid,
                    currentUser!.name, currentUser!.email, currentUser!.userType, currentUser!.profilePicture

                )
            })
            .catch((error) => {
                console.log(error)
            })
    }

    async sendPasswordReset(email){
        return await sendPasswordResetEmail(this.auth, email)
            .then(() =>{
                console.log('Password reset email sent!');
            })
            .catch((error) => {
                console.log(error)
            })
    }

    async signOut(){
        return await signOut(this.auth)
            .then(async() =>{
                console.log('User signed out');
            })
            .catch((error) =>{
                console.error("error signing out", error);
            })       
    }

}   

const firebaseInstance = new Firebase()
export { firebaseInstance }