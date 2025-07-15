// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDkuzS1sgZ5iiVWYtMZkSKLrhm4EsYbSLg",
  authDomain: "assignment-12-b71cb.firebaseapp.com",
  projectId: "assignment-12-b71cb",
  storageBucket: "assignment-12-b71cb.firebasestorage.app",
  messagingSenderId: "765859928356",
  appId: "1:765859928356:web:4ede8bdf790a440e517bb1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();