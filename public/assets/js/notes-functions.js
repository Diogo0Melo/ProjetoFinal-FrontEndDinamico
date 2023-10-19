import { getInfosFromDB, updateUserInDB } from "./firebase.js";

const sec = document.getElementById("police");
const userID = JSON.parse(sessionStorage.getItem("@user")).uid;
let userInfos = JSON.parse(localStorage.getItem(userID));
async function loadNotesFromStorage() {
    if (!userInfos) {
        await getInfosFromDB(userID);
        userInfos = JSON.parse(localStorage.getItem(userID));
    }

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
    } else if (event.target.textContent.includes("Concluída")) {
        event.target.innerHTML = "Concluir";

        userInfos.notes[index].completed = false;
        localStorage.setItem(userID, JSON.stringify(userInfos));
    }
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

function editContent(event) {
    const card = event.relatedTarget;
    const title = card.querySelector(".card-title").textContent;
    const description = card.querySelector(".card-text").textContent;
    const modalTitle = exampleModal.querySelector(".modal-title");
    const modalInputTitle = exampleModal.querySelector(".modal-body input");
    const modalTextArea = exampleModal.querySelector(".modal-body textarea");
    const modalSaveButton = exampleModal.querySelector("#add-note");
    modalTitle.textContent = "Editar Nota";
    modalInputTitle.value = title;
    modalTextArea.value = description;
    modalSaveButton.addEventListener("click", () => {
        const index = userInfos.notes.findIndex((note) => {
            return note.title === card.querySelector("h5").textContent;
        });
        userInfos.notes[index].title = modalInputTitle.value;
        userInfos.notes[index].description = modalTextArea.value;
        localStorage.setItem(userID, JSON.stringify(userInfos));
        location.reload();
    });
    modalSaveButton.removeEventListener("click", newNote);
}
exampleModal.addEventListener("show.bs.modal", (event) => {
    const modalTitle = exampleModal.querySelector(".modal-title");
    modalTitle.textContent = "Criar Nova Nota";
});
exampleModal.addEventListener("show.bs.modal", editContent);

// function editContent(card) {
//     document.getElementById("exampleModal").innerHTML = `
//         <div class="modal-dialog">
//         <div class="modal-content">
//             <div class="modal-header">
//                 <h1 class="modal-title fs-5" id="exampleModalLabel">
//                     Criar Nova Nota
//                 </h1>
//                 <button
//                     type="button"
//                     class="btn-close"
//                     data-bs-dismiss="modal"
//                     aria-label="Close"
//                 ></button>
//             </div>
//             <div class="modal-body">
//                 <form>
//                     <div class="mb-3">
//                         <label
//                             for="recipient-name"
//                             class="col-form-label"
//                             >Título:</label
//                         >
//                         <input
//                             type="text"
//                             class="form-control"
//                             id="note-title"
//                             value="${1 + 1}"
//                         />
//                     </div>
//                     <div class="mb-3">
//                         <label
//                             for="message-text"
//                             class="col-form-label"
//                             >Descrição:</label
//                         >
//                         <textarea
//                             rows="9"
//                             class="form-control"
//                             id="note-description"
//                         >${2 + 4}</textarea>
//                     </div>
//                 </form>
//             </div>
//             <div class="modal-footer">
//                 <button
//                     type="button"
//                     class="btn btn-secondary"
//                     data-bs-dismiss="modal"
//                 >
//                     Cancelar
//                 </button>
//                 <button
//                     type="button"
//                     id="add-note"
//                     class="btn btn-primary"
//                     data-bs-dismiss="modal"
//                 >
//                     Salvar
//                 </button>
//             </div>
//         </div>
//     </div>`;
// }
export { loadNotesFromStorage, newNote };
