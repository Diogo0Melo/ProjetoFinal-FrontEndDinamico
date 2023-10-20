import { getInfosFromDB, updateUserInDB } from "./firebase.js";

const userID = JSON.parse(sessionStorage.getItem("@user")).uid;
let userInfos = JSON.parse(localStorage.getItem(userID));
async function loadNotesFromStorage() {
    if (!userInfos) {
        await getInfosFromDB(userID);
        userInfos = JSON.parse(localStorage.getItem(userID));
        location.reload();
    }
    const sec = document.getElementById("police");
    userInfos.notes.forEach((note) => {
        sec.innerHTML += `
            <div class="card cp">
                <div class="card-body" data-bs-toggle="modal" data-bs-target="#exampleModal">
                    <h5 class="card-title">${note.title}</h5>
                    <p class="card-text">${note.description}</p>
                    <div class="card-footer">Ultima modificação - 18/10</div>
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
    const note = {
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

const exampleModal = document.getElementById("exampleModal");
const modalSaveButton = exampleModal.querySelector("#add-note");
function modalSaveButtonFunction(e, modalInputTitle, modalTextArea, card) {
    editModalSave(modalInputTitle, modalTextArea, card);
}
function editContent(event) {
    const card = event.relatedTarget;
    const title = card.querySelector(".card-title").textContent;
    const description = card.querySelector(".card-text").textContent;
    const modalTitle = exampleModal.querySelector(".modal-title");
    const modalInputTitle = exampleModal.querySelector(".modal-body input");
    const modalTextArea = exampleModal.querySelector(".modal-body textarea");
    if (card instanceof HTMLAnchorElement) {
        modalSaveButton.removeEventListener("click", modalSaveButtonFunction);
        modalSaveButton.addEventListener("click", newNote);
        modalTitle.textContent = "Criar Nova Nota";
        return;
    }
    modalTitle.textContent = "Editar Nota";
    modalInputTitle.value = title;
    modalTextArea.value = description;
    modalSaveButton.addEventListener("click", modalSaveButtonFunction);
    modalSaveButton.removeEventListener("click", newNote);
}
function editModalSave(modalInputTitle, modalTextArea, card) {
    const index = userInfos.notes.findIndex((note) => {
        return note.title === card.querySelector("h5").textContent;
    });
    userInfos.notes[index].title = modalInputTitle.value;
    userInfos.notes[index].description = modalTextArea.value;
    localStorage.setItem(userID, JSON.stringify(userInfos));
    location.reload();
}
export { loadNotesFromStorage, newNote, editContent };
