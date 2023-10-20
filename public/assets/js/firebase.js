import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import {
    getFirestore,
    collection,
    getDocs,
    query,
    where,
    setDoc,
    doc,
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
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
const indexPageRoute = window.location.href.includes("web.app")
    ? "/"
    : "/public/";
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
    if (userRef.empty) return;
    await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        username,
        notes: [],
    });
    localStorage.setItem(user.uid, JSON.stringify({ username, notes: [] }));
}
async function getInfosFromDB(userID) {
    const userRef = await query(
        collection(db, "users"),
        where("uid", "==", userID)
    );
    const user = await getDocs(userRef);
    localStorage.setItem(userID, JSON.stringify(user.docs[0].data()));
}
async function updateUserInDB(userID, notes) {
    await setDoc(doc(db, "users", userID), notes);
}
export { getInfosFromDB, updateUserInDB };

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
            .then(async (userCredential) => {
                const user = userCredential.user;
                await addUserToDB(user, username);
                window.location.href = indexPageRoute;
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
                window.location.href = indexPageRoute;
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
            const user = result.user;
            await addUserToDB(user, user.displayName);
            window.location.href = indexPageRoute;
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            const credential = GoogleAuthProvider.credentialFromError(error);
            console.log(errorCode, errorMessage, credential, error);
        });
}

btnGoogle?.addEventListener("click", loginGoogle);
