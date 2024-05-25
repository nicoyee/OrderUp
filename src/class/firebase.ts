import { 
    Auth, 
    getAuth, 
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
} from "firebase/storage";
import { initializeApp } from "firebase/app";

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
}   

const firebaseInstance = new Firebase()
export { firebaseInstance }