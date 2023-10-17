// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";

// import { getFirestore, collection, getDocs } from "/firebase/firestore/lite";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import {
    getFirestore,
    collection,
    getDocs,
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Get a list of cities from your database
async function getCities(db) {
    const users = collection(db, "users");
    const citySnapshot = await getDocs(users);
    const cityList = citySnapshot.docs.map((doc) => doc.data());
    return cityList;
}

getCities(db).then((cityList) => {
    console.log(cityList);
});
