import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyA1QeDf1E_Kb1ZC15ahw1dY8hk3J0gXopY",
  authDomain: "thodu-65cb9.firebaseapp.com",
  databaseURL: "https://thodu-65cb9-default-rtdb.firebaseio.com",
  projectId: "thodu-65cb9",
  storageBucket: "thodu-65cb9.firebasestorage.app",
  messagingSenderId: "1070229943496",
  appId: "1:1070229943496:web:038e2e74c463e7acefa1fd",
  measurementId: "G-NF17LPGHWV"
};

const app = initializeApp(firebaseConfig);
export const rtdb = getDatabase(app);
export default app;
