import { getInfosFromDB, updateUserInDB } from "./firebase.js";
import { createFirstNoteIconOrNoteContainer, allowSync } from "./script.js";

const sec = document.getElementById("police");
const userID = JSON.parse(sessionStorage.getItem("@user")).uid;
const userInfos = JSON.parse(localStorage.getItem(userID));
async function loadNotesFromStorage(forceRequest) {
    if (!userInfos || forceRequest) {
        forceRequest ? localStorage.removeItem(userID) : null;
        const user = JSON.parse(sessionStorage.getItem("@user"));
        await getInfosFromDB(userID, user);
        location.reload();
        return;
    }
    userInfos.notes?.forEach((note) => {
        sec.innerHTML += `
            <div class="card cp">
                <div class="card-body" id="${note.id}" data-bs-toggle="modal"data-bs-target="#exampleModal">
                    <h5 class="card-title">${note.title}</h5>
                    <p class="card-text">${note.description}</p>
                    <div class="card-footer"></div>
                </div>
                <div class="d-flex flex-direction-row bt-container">
                </div>
            </div> `;
    });
    addButtonsToCards();
}
function addButtonsToCards() {
    const cards = Array.from(document.querySelectorAll("div.card.cp"));
    cards.forEach((card) => {
        const btnConcluir = document.createElement("button");
        const btnExcluir = document.createElement("button");
        btnConcluir.classList.add("btn", "btn-primary");
        btnConcluir.innerHTML = "Concluir";
        btnExcluir.classList.add("btn", "btn-danger", "btn-primary");
        btnExcluir.innerHTML = "Excluir";
        const btnContainer = card.querySelector(".bt-container");
        btnContainer.appendChild(btnConcluir);
        btnContainer.appendChild(btnExcluir);
        btnConcluir.addEventListener("click", completedNote);
        btnExcluir.addEventListener("click", removeNote);
    });
    userInfos.notes?.forEach((note) => {
        if (!note.completed) {
            return;
        }
        const cardID = cards.find((card) => {
            return (
                card.querySelector(".card-body").getAttribute("id") == note.id
            );
        });
        const btn = cardID.querySelector("button");
        btn.innerHTML = `Concluída <i class="bi bi-check-circle-fill"></i>`;
        btn.classList.add("tarefa-concluida");
    });
}

async function newNote() {
    const id = userInfos.noteID++;
    const title = document.querySelector("#note-title").value;
    const description = document.querySelector("#note-description").value;
    const note = {
        id,
        title,
        description,
    };
    userInfos.notes.push(note);
    localStorage.setItem(userID, JSON.stringify(userInfos));
    await updateUserInDB(userID, userInfos);
    reloadNotes();
    hideModal();
}
function completedNote(event) {
    event.target.classList.toggle("tarefa-concluida");
    const card = event.target.parentNode.parentNode;
    const index = userInfos.notes.findIndex((note) => {
        return note.title === card.querySelector("h5").textContent;
    });
    if (event.target.textContent == "Concluir") {
        event.target.innerHTML = `Concluída <i class="bi bi-check-circle-fill"></i>`;
        userInfos.notes[index].completed = true;
        localStorage.setItem(userID, JSON.stringify(userInfos));
        return;
    }
    if (!event.target.textContent.includes("Concluída")) {
        return;
    }
    event.target.innerHTML = "Concluir";

    userInfos.notes[index].completed = false;
    localStorage.setItem(userID, JSON.stringify(userInfos));
}
function removeNote(event) {
    const card = event.target.parentNode.parentNode;
    const index = userInfos.notes.findIndex((note) => {
        return note.title === card.querySelector("h5").textContent;
    });
    userInfos.notes.splice(index, 1);
    localStorage.setItem(userID, JSON.stringify(userInfos));
    reloadNotes();
}
const modalSaveButton = document.querySelector("#add-note");
function editNote(event) {
    const card = event.relatedTarget;
    const modalTitle = document.querySelector("#exampleModalLabel");
    if (
        card instanceof HTMLAnchorElement ||
        card instanceof HTMLSpanElement ||
        card.hasAttribute("i-tag")
    ) {
        modalTitle.innerHTML = "Criar Nova Nota";
        modalSaveButton.addEventListener("click", newNote);
        return;
    }
    const title = card.querySelector("h5").textContent;
    const description = card.querySelector("p").textContent;

    modalTitle.innerHTML = "Editar Nota";
    document.querySelector("#note-title").value = title;
    document.querySelector("#note-description").value = description;
    modalSaveButton.setAttribute("idnote", card.id);
    modalSaveButton.removeEventListener("click", newNote);
    modalSaveButton.addEventListener("click", editNoteSaveButtonFunction);
}
function editNoteSaveButtonFunction(e) {
    const newTitle = document.querySelector("#note-title").value;
    const newDescription = document.querySelector("#note-description").value;
    const index = userInfos.notes.findIndex((note) => {
        return note.id == e.target.getAttribute("idnote");
    });
    userInfos.notes[index].title = newTitle;
    userInfos.notes[index].description = newDescription;
    localStorage.setItem(userID, JSON.stringify(userInfos));
    reloadNotes();
    hideModal();
}
function hideModal() {
    modalSaveButton.setAttribute("data-bs-dismiss", "modal");
    modalSaveButton.removeEventListener("click", editNoteSaveButtonFunction);
    modalSaveButton.removeEventListener("click", newNote);
    modalSaveButton.click();
    modalSaveButton.removeAttribute("data-bs-dismiss");
}
async function reloadNotes(forceRequest = false) {
    sec.innerHTML = "";
    await loadNotesFromStorage(forceRequest);
    createFirstNoteIconOrNoteContainer();
}

async function syncNotes(e) {
    if (userInfos.syncTime > Date.now()) {
        return;
    }
    userInfos.syncTime = Date.now() + 1000 * 60 * 8;
    localStorage.setItem(userID, JSON.stringify(userInfos));
    allowSync();
    if (e.target.id == "send-notes") {
        await updateUserInDB(userID, userInfos);
        return;
    }
    if (e.target.id != "pull-notes") {
        return;
    }
    await getInfosFromDB(userID);
    await reloadNotes(true);
    return;
}
function searchNotes() {
    const search = document.querySelector("#search-note").value;
    const cards = Array.from(document.querySelectorAll("div.card.cp"));
    cards.forEach((card) => {
        const title = card.querySelector("h5").textContent.toLowerCase();
        const description = card.querySelector("p").textContent.toLowerCase();
        if (title.includes(search) || description.includes(search)) {
            card.removeAttribute("hidden");
        } else if (search == "") {
            card.removeAttribute("hidden");
        } else {
            card.setAttribute("hidden", "");
        }
    });
}

export {
    loadNotesFromStorage,
    newNote,
    editNote,
    editNoteSaveButtonFunction,
    syncNotes,
    searchNotes,
};
