// src/firebase/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getStorage } from 'firebase/storage'; // Import Firebase Storage

const firebaseConfig = {
    apiKey: "AIzaSyBpdkFZgvWjKGQzPjidQ9udniZtHKRRo7A",
    authDomain: "im-101-85b8d.firebaseapp.com",
    projectId: "im-101-85b8d",
    storageBucket: "im-101-85b8d.appspot.com",
    messagingSenderId: "795129016945",
    appId: "1:795129016945:web:6ad761b2942983ebbba1d0",
    measurementId: "G-N6X2XYV05C"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app); // Initialize Firebase Storage

const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider, storage }; // Export storage
