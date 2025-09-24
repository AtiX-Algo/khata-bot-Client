// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // 👈 Import the auth service

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDFlMUktaXV7RZWAtz5jEVPYa4nG6RnVv0",
  authDomain: "khata-bot.firebaseapp.com",
  projectId: "khata-bot",
  storageBucket: "khata-bot.appspot.com", // Corrected domain
  messagingSenderId: "600954847787",
  appId: "1:600954847787:web:c9a7c5ff1030a725a9606e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the auth service to be used in other files
export const auth = getAuth(app); // 👈 Export auth