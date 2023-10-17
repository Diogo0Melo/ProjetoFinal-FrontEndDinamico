import app from "./firebase.js";
import {
    getFirestore,
    collection,
    getDocs,
    addDoc,
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";

const db = getFirestore(app);

const addUser = async (user) => {
    const docRef = await addDoc(collection(db, "users"), {
        uid: user.uid,
        email: user.email,
    });
};
const getUser = async (user) => {
    const querySnapshot = await getDocs(collection(db, "users"));
    querySnapshot.forEach((doc) => {});
};

export { addUser, getUser };
