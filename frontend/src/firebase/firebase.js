// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBV5qxiFxIIt7Ld5l8y0IfentNrL17_oGc",
  authDomain: "reflect-thesis-app.firebaseapp.com",
  databaseURL: "https://reflect-thesis-app-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "reflect-thesis-app",
  storageBucket: "reflect-thesis-app.appspot.com",
  messagingSenderId: "393540772653",
  appId: "1:393540772653:web:a9dcd6f10803de9debe9a4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

export { auth, database };
