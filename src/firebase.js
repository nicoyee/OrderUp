// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCfI4xkjg99phmVltisyBQahPIQlHMFc-4",
  authDomain: "orderup-14fbd.firebaseapp.com",
  projectId: "orderup-14fbd",
  storageBucket: "orderup-14fbd.appspot.com",
  messagingSenderId: "202358235176",
  appId: "1:202358235176:web:482e1544c3990734bd551d",
  measurementId: "G-KB2290KV8P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, app, db, storage, analytics }

