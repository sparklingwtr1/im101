// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyALua70c_Hq5XSgTPqWA-EfQIjN5cc0swU",
    authDomain: "im101-3c228.firebaseapp.com",
    projectId: "im101-3c228",
    storageBucket: "im101-3c228.firebasestorage.app",
    messagingSenderId: "695472697763",
    appId: "1:695472697763:web:026ffbbfc1a3177a7aea16",
    measurementId: "G-PTG97Y7QNB"
  };

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { firestore };
