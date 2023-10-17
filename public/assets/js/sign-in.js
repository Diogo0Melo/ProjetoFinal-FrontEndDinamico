import app from "./firebase.js";
import { getUser } from "./db.js";
import {
    getAuth,
    signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";

const auth = getAuth();

const btn = document.querySelector("button");
btn.addEventListener("click", () => {
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            sessionStorage.setItem("@visited", true);
            window.location.href = "/public/index.html";
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
        });
});
