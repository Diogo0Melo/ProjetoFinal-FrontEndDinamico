import {
    loadNotesFromStorage,
    newNote,
    editNote,
    editNoteSaveButtonFunction,
} from "./notes-func.js";

const userID = JSON.parse(sessionStorage.getItem("@user")).uid;
const userInfos = JSON.parse(localStorage.getItem(userID));

function createFirstNoteIconOrNoteContainer() {
    const icon = document.querySelector(".iconizao");
    if (userInfos?.notes.length > 0) {
        const sec = document.getElementById("police");
        sec.removeAttribute("hidden");
        icon.setAttribute("hidden", "");
        return;
    }
}
function logout(event) {
    event.preventDefault();
    sessionStorage.removeItem("@visited");
    sessionStorage.removeItem("@user");
    location.reload();
}
window.onload = async () => {
    const modal = document.querySelector("#exampleModal");
    const btnAddNote = document.querySelector("#add-note");
    const btnLogout = document.querySelector("#logout");
    btnAddNote.addEventListener("click", newNote);
    btnLogout.addEventListener("click", logout);
    modal.addEventListener("show.bs.modal", editNote);
    modal.addEventListener("hide.bs.modal", () => {
        btnAddNote.removeEventListener("click", editNoteSaveButtonFunction);
        modal.querySelector("#note-title").value = "";
        modal.querySelector("#note-description").value = "";
    });
    createFirstNoteIconOrNoteContainer();
    await loadNotesFromStorage();
};
