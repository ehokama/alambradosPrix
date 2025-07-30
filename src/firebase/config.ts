import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; 

// Your web app's Firebase configuration
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

export const auth = getAuth(app);
