// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB6PJ9z2lVxzYTMVoVsZOTTYx0QhnJU0Fg",
  authDomain: "ai-trip-planner-eb953.firebaseapp.com",
  projectId: "ai-trip-planner-eb953",
  storageBucket: "ai-trip-planner-eb953.appspot.com",
  messagingSenderId: "712110389945",
  appId: "1:712110389945:web:d2012249d5e11d0ac63968",
  measurementId: "G-MG44L926ZM"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db=getFirestore(app);
// const analytics = getAnalytics(app);