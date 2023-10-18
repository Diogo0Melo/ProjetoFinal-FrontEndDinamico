import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import {
    getFirestore,
    collection,
    getDocs,
    addDoc,
    query,
    where,
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    GoogleAuthProvider,
    signInWithPopup,
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyBdbTFC3iFvWtKsprUmrYQlYTQCcKWiB7Y",
    authDomain: "frontenddinamico-projetofinal.firebaseapp.com",
    projectId: "frontenddinamico-projetofinal",
    storageBucket: "frontenddinamico-projetofinal.appspot.com",
    messagingSenderId: "766236256676",
    appId: "1:766236256676:web:bcc32733297b79a0f77931",
};
const app = initializeApp(firebaseConfig);

// banco de dados

const db = getFirestore(app);

async function addUserToDB(user, username) {
    sessionStorage.setItem("@user", JSON.stringify(user));
    sessionStorage.setItem("@visited", "true");
    if (localStorage.getItem(user.uid)) return;
    const userRef = await query(
        collection(db, "users"),
        where("uid", "==", user.uid)
    );
    if (!userRef.empty) return;
    await addDoc(collection(db, "users"), {
        uid: user.uid,
        username: user.displayName,
        notes: [],
    });
    localStorage.setItem(user.uid, JSON.stringify({ username, notes: [] }));
}

// cadastramento e login de usuário

const auth = getAuth();
const btn = document.querySelector("button");
async function login() {
    const username = document.querySelector("#username")?.value;
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;
    const url = window.location.href;
    if (url.includes("sign-in")) {
        await signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                window.location.href = "/public/index.html";
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage, error);
            });
    } else if (url.includes("sign-up")) {
        await createUserWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
                const user = userCredential.user;
                await addUserToDB(user, username);
                window.location.href = "/public/index.html";
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage, error);
            });
    }
}
btn?.addEventListener("click", login);

// login com google

const btnGoogle = document.querySelector("#google");
const provider = new GoogleAuthProvider();
async function loginGoogle() {
    signInWithPopup(auth, provider)
        .then(async (result) => {
            // const credential = GoogleAuthProvider.credentialFromResult(result);
            // const token = credential.accessToken;
            const user = result.user;
            await addUserToDB(user, user.displayName);
            window.location.href = "/public/index.html";
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            const credential = GoogleAuthProvider.credentialFromError(error);
            console.log(errorCode, errorMessage, credential, error);
        });
}

btnGoogle?.addEventListener("click", loginGoogle);
