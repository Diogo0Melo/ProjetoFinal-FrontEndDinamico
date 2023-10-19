import { loadNotesFromStorage, newNote } from "./notes-functions.js";

const main = document.querySelector("main");
const userID = JSON.parse(sessionStorage.getItem("@user")).uid;
const userInfos = JSON.parse(localStorage.getItem(userID));
window.onload = async () => {
    createModalAndNoteContainer();
    loadNotesFromStorage();
    const btnAddNote = document.querySelector("#add-note");
    btnAddNote?.addEventListener("click", newNote);
};

// const sec = document.getElementById("police");
// for (let i = 0; i < 5; i++) {
//     sec.innerHTML += `
// <div class="card" id="cardCarregamento" aria-hidden="true">
//   <div class="card-body">
//       <h5 class="card-title placeholder-glow">
//           <span class="placeholder col-6"></span>
//       </h5>
//       <p class="card-text placeholder-glow">
//           <span class="placeholder col-7"></span>
//           <span class="placeholder col-4"></span>
//           <span class="placeholder col-4"></span>
//           <span class="placeholder col-6"></span>
//           <span class="placeholder col-8"></span>
//       </p>
//       <a
//           class="btn btn-primary disabled placeholder col-6"
//           aria-disabled="true"
//       ></a>
//   </div>
// </div>`;
// }

function createModalAndNoteContainer() {
    if (userInfos.notes.length > 0) return;
    main.innerHTML = `
  <div class="iconizao">
  <i data-bs-toggle="modal" data-bs-target="#exampleModal" class="bi cp bi-clipboard-plus"></i>
  <span data-bs-toggle="modal" data-bs-target="#exampleModal" class="cp">Nova tarefa</span>
</div>

<div
                class="modal fade"
                id="exampleModal"
                tabindex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
            >
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="exampleModalLabel">
                                Criar Nova Nota
                            </h1>
                            <button
                                type="button"
                                class="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <div class="modal-body">
                            <form>
                                <div class="mb-3">
                                    <label
                                        for="recipient-name"
                                        class="col-form-label"
                                        >Título:</label
                                    >
                                    <input
                                        type="text"
                                        class="form-control"
                                        id="note-title"
                                    />
                                </div>
                                <div class="mb-3">
                                    <label
                                        for="message-text"
                                        class="col-form-label"
                                        >Descrição:</label
                                    >
                                    <textarea
                                        rows="9"
                                        class="form-control"
                                        id="note-description"
                                    ></textarea>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button
                                type="button"
                                class="btn btn-secondary"
                                data-bs-dismiss="modal"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                id="add-note"
                                class="btn btn-primary"
                                data-bs-dismiss="modal"
                            >
                                Salvar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
`;
}
function logout(event) {
    event.preventDefault();
    sessionStorage.removeItem("@visited");
    sessionStorage.removeItem("@user");
    location.reload();
}
const btnLogout = document.querySelector("#logout");
btnLogout?.addEventListener("click", logout);
