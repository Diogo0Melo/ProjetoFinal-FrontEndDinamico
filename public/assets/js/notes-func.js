import { getInfosFromDB, updateUserInDB } from "./firebase.js";

const sec = document.getElementById("police");
const userID = JSON.parse(sessionStorage.getItem("@user")).uid;
let userInfos = JSON.parse(localStorage.getItem(userID));
async function loadNotesFromStorage() {
    if (!userInfos) {
        await getInfosFromDB(userID);
        userInfos = JSON.parse(localStorage.getItem(userID));
        location.reload();
    }
    userInfos.notes.forEach((note) => {
        sec.innerHTML += `
            <div class="card cp" " >
                <div class="card-body" id="${note.id}" data-bs-toggle="modal"data-bs-target="#exampleModal">
                    <h5 class="card-title">${note.title}</h5>
                    <p class="card-text">${note.description}</p>
                    <div class="card-footer"></div>
                </div>
                <div class="d-flex flex-direction-row bt-container">
                </div>
            </div> `;
    });
    const cards = document.querySelectorAll("div.card.cp");
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
    userInfos = JSON.parse(localStorage.getItem(userID));
    let i = 0;
    userInfos.notes.forEach((note) => {
        if (note.completed) {
            const btn = cards[i].querySelector("button");
            btn.innerHTML = `Concluída <i class="bi bi-check-circle-fill"></i>`;
            btn.classList.add("tarefa-concluida");
        }
        i++;
    });
}

async function newNote() {
    const title = document.querySelector("#note-title").value;
    const description = document.querySelector("#note-description").value;
    if (!userInfos) {
        await getInfosFromDB(userID);
        userInfos = JSON.parse(localStorage.getItem(userID));
    }
    const id = userInfos.noteID++;
    const note = {
        id,
        title,
        description,
    };
    userInfos.notes.push(note);
    localStorage.setItem(userID, JSON.stringify(userInfos));
    await updateUserInDB(userID, userInfos);
    location.reload();
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
    card.remove();
}
const modalSaveButton = document.querySelector("#add-note");
function editNote(event) {
    const card = event.relatedTarget;
    const modalTitle = document.querySelector("#exampleModalLabel");
    if (card instanceof HTMLAnchorElement) {
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
    sec.innerHTML = "";
    loadNotesFromStorage();
    hideModal();
}
function hideModal() {
    modalSaveButton.setAttribute("data-bs-dismiss", "modal");
    modalSaveButton.removeEventListener("click", editNoteSaveButtonFunction);
    modalSaveButton.click();
    modalSaveButton.removeAttribute("data-bs-dismiss");
}
export { loadNotesFromStorage, newNote, editNote, editNoteSaveButtonFunction };
