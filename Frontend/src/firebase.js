import { initializeApp } from "firebase/app";

import {getMessaging} from "firebase/messaging"

const firebaseConfig = {
  apiKey: "AIzaSyA3uaNQ22n4CMrpOlYSHY4l0zCq3JGbN0k",
  authDomain: "healthtrack-507408.firebaseapp.com",
  projectId: "healthtrack-507408",
  storageBucket: "healthtrack-507408.firebasestorage.app",
  messagingSenderId: "219847939232",
  appId: "1:219847939232:web:b30e906c4eba01adb7a5c5"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const messaging=getMessaging(app);