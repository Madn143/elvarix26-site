import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCKONi6zq0JUfsgPadcQPk0eYD9bHpogMc",
  authDomain: "elvarix26.firebaseapp.com",
  projectId: "elvarix26",
  storageBucket: "elvarix26.firebasestorage.app",
  messagingSenderId: "773443130796",
  appId: "1:773443130796:web:9f6fbc9d33f70c23455609"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
