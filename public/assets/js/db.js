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
const firebaseConfig = {
    apiKey: "AIzaSyBdbTFC3iFvWtKsprUmrYQlYTQCcKWiB7Y",
    authDomain: "frontenddinamico-projetofinal.firebaseapp.com",
    projectId: "frontenddinamico-projetofinal",
    storageBucket: "frontenddinamico-projetofinal.appspot.com",
    messagingSenderId: "766236256676",
    appId: "1:766236256676:web:bcc32733297b79a0f77931",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Get a list of cities from your database
// async function getCities(db) {
//     console.log("bababo222222222i");
//     const users = collection(db, "users");
//     const citySnapshot = await getDocs(users);
//     console.log("baba111111111111boi");
//     const cityList = citySnapshot.docs.map((doc) => doc.data());
//     return cityList;
// }

// getCities(db).then((cityList) => {
//     console.log("bababoi");
//     console.log(cityList);
// });
// const a = document.createElement("h1");
// a.textContent = "o213232323232iiiiiiiiiiiiiiiiii";
// document.body.appendChild(a);
