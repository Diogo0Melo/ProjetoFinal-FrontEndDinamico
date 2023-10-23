import {
    loadNotesFromStorage,
    newNote,
    editNote,
    editNoteSaveButtonFunction,
    syncNotes,
    searchNote,
} from "./notes-func.js";

const userID = JSON.parse(sessionStorage.getItem("@user")).uid;
let userInfos = JSON.parse(localStorage.getItem(userID));

function createFirstNoteIconOrNoteContainer() {
    userInfos = JSON.parse(localStorage.getItem(userID));
    const icon = document.querySelector(".iconizao");
    const newNoteIcon = document.querySelector("#new-note");
    const sec = document.getElementById("police");
    if (userInfos?.notes?.length == 0) {
        icon.removeAttribute("hidden");
        sec.setAttribute("hidden", "");
        newNoteIcon.setAttribute("hidden", "");
        return false;
    }

    newNoteIcon.removeAttribute("hidden");
    sec.removeAttribute("hidden");
    icon.setAttribute("hidden", "");
    return true;
}
function logout(event) {
    event.preventDefault();
    sessionStorage.removeItem("@visited");
    sessionStorage.removeItem("@user");
    location.reload();
}
window.onresize = () => {
    const screen = window.matchMedia("(max-width: 1024px)");
    const mobileHeader = document.querySelector("#mobile-header");
    const desktopHeader = document.querySelector("#desktop-header");
    if (screen.matches) {
        mobileHeader.removeAttribute("hidden");
        desktopHeader.setAttribute("hidden", "");
    } else {
        mobileHeader.setAttribute("hidden", "");
        desktopHeader.removeAttribute("hidden");
    }
};
window.onload = async () => {
    userInfos = JSON.parse(localStorage.getItem(userID));
    const modal = document.querySelector("#exampleModal");
    const btnAddNote = document.querySelector("#add-note");
    const ButtonsLogout = document.querySelectorAll("#logout");
    const syncSendButton = document.querySelector("#send-notes");
    const syncPullButton = document.querySelector("#pull-notes");
    const userWelcomeMSG = document.querySelectorAll("#userWelcomeMSG");
    const inputSearch = document.querySelector("#search-note");
    const forceDataUpdate = userInfos.forceDataUpdate == undefined;
    ButtonsLogout.forEach((btn) => {
        btn.addEventListener("click", logout);
    });
    userWelcomeMSG[1].textContent = userInfos?.username;
    userWelcomeMSG[0].textContent = userInfos?.username;
    syncPullButton.addEventListener("click", syncNotes);
    syncSendButton.addEventListener("click", syncNotes);
    setInterval(() => {
        userInfos = JSON.parse(localStorage.getItem(userID));

        if (userInfos.syncTime > Date.now()) {
            syncSendButton.setAttribute("disabled", "");
            syncPullButton.setAttribute("disabled", "");

            return;
        }

        syncPullButton.removeAttribute("disabled");
        syncSendButton.removeAttribute("disabled");
    }, 1000 * 60);
    btnAddNote.addEventListener("click", newNote);
    modal.addEventListener("show.bs.modal", editNote);
    modal.addEventListener("hide.bs.modal", () => {
        btnAddNote.removeEventListener("click", editNoteSaveButtonFunction);
        modal.querySelector("#note-title").value = "";
        modal.querySelector("#note-description").value = "";
    });
    inputSearch.addEventListener("input", searchNote);
    createFirstNoteIconOrNoteContainer();

    await loadNotesFromStorage(forceDataUpdate);
};

export { createFirstNoteIconOrNoteContainer };
