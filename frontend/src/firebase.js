// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBgGzAOM-ux3RkE4tLXdothJd0aF3qyt5g",
  authDomain: "itp-2025-15b25.firebaseapp.com",
  projectId: "itp-2025-15b25",
  storageBucket: "itp-2025-15b25.firebasestorage.app",
  messagingSenderId: "531122629927",
  appId: "1:531122629927:web:81c439f809c87cc1408d02",
  measurementId: "G-SCF8E8Z6W5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
