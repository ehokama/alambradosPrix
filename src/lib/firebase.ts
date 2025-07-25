// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCFI4IPgrIAvweDKwsBM94Jf1RVaZCu-58",
  authDomain: "alambradosprix-f4131.firebaseapp.com",
  projectId: "alambradosprix-f4131",
  storageBucket: "alambradosprix-f4131.firebasestorage.app",
  messagingSenderId: "744670866786",
  appId: "1:744670866786:web:28a5373a275af0c735903b",
  measurementId: "G-4FN6L0N0HX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);