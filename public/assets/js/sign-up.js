import app from "./firebase.js";
import { addUser } from "./db.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";

const auth = getAuth();

const btn = document.querySelector("button");
btn.addEventListener("click", () => {
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            addUser(user);
            localStorage.setItem(user.uid, []);
            sessionStorage.setItem("@visited", true);
            sessionStorage.setItem(user.uid, JSON.stringify(user));
            window.location.href = "/public/index.html";
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
        });
});
