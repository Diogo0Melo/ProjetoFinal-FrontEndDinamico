import {
    loadNotesFromStorage,
    newNote,
    editNote,
    editNoteSaveButtonFunction,
    syncNotes,
    searchNotes,
} from "./notes-func.js";

const userID = JSON.parse(sessionStorage.getItem("@user")).uid;
const syncSendButton = document.querySelector("#send-notes");
const syncPullButton = document.querySelector("#pull-notes");
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
function headerSwitch() {
    const screen = window.matchMedia("(max-width: 1024px)");
    const mobileHeader = document.querySelector("#mobile-header");
    const desktopHeader = document.querySelector("#desktop-header");
    const mobileHeaderContent = document.querySelector(
        "#navbarToggleExternalContent"
    );
    if (screen.matches) {
        mobileHeader.removeAttribute("hidden");
        desktopHeader.setAttribute("hidden", "");
        mobileHeaderContent.removeAttribute("hidden");
        return;
    }
    mobileHeader.setAttribute("hidden", "");
    desktopHeader.removeAttribute("hidden");
    mobileHeaderContent.setAttribute("hidden", "");
}
function allowSync() {
    userInfos = JSON.parse(localStorage.getItem(userID));
    setTimeout(allowSync, 1001 * 60 * 8);
    if (userInfos.syncTime > Date.now()) {
        syncSendButton.setAttribute("disabled", "");
        syncPullButton.setAttribute("disabled", "");
        syncPullButton.removeEventListener("click", syncNotes);
        syncSendButton.removeEventListener("click", syncNotes);
        return;
    }
    syncPullButton.addEventListener("click", syncNotes);
    syncSendButton.addEventListener("click", syncNotes);
    syncPullButton.removeAttribute("disabled");
    syncSendButton.removeAttribute("disabled");
}

window.onload = async () => {
    userInfos = JSON.parse(localStorage.getItem(userID));
    const modal = document.querySelector("#exampleModal");
    const btnAddNote = document.querySelector("#add-note");
    const ButtonsLogout = document.querySelectorAll("#logout");
    const userWelcomeMSG = document.querySelectorAll("#userWelcomeMSG");
    const inputSearch = document.querySelector("#search-note");
    const forceDataUpdate = userInfos?.forceDataUpdate == undefined;
    window.addEventListener("resize", headerSwitch);
    ButtonsLogout.forEach((btn) => {
        btn.addEventListener("click", logout);
    });
    userWelcomeMSG[1].textContent = userInfos?.username;
    userWelcomeMSG[0].textContent = userInfos?.username;
    btnAddNote.addEventListener("click", newNote);
    modal.addEventListener("show.bs.modal", editNote);
    modal.addEventListener("hide.bs.modal", () => {
        btnAddNote.removeEventListener("click", editNoteSaveButtonFunction);
        modal.querySelector("#note-title").value = "";
        modal.querySelector("#note-description").value = "";
    });
    inputSearch.addEventListener("input", searchNotes);
    headerSwitch();
    allowSync();
    await loadNotesFromStorage(forceDataUpdate);
    createFirstNoteIconOrNoteContainer();
};

export { createFirstNoteIconOrNoteContainer, allowSync };
