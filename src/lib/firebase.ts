
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "eduguideai-2uoxv",
  "appId": "1:38845720202:web:781cb67dec33067346ef73",
  "storageBucket": "eduguideai-2uoxv.firebasestorage.app",
  "apiKey": "AIzaSyDXOObixEXbvo2_UNrNNjITOt5s6tVUuco",
  "authDomain": "eduguideai-2uoxv.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "38845720202"
};


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
