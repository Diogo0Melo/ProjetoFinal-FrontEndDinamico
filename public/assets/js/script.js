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

const sec = document.getElementById("police");
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

function concluiu() {
    const botaoConcluir = document.getElementById("btConcluir");
    botaoConcluir.classList.toggle("tarefa-concluida");
    if (botaoConcluir.textContent == "Concluir") {
        botaoConcluir.innerHTML = `Concluída <i class="bi bi-check-circle-fill"></i>`;
    } else {
        botaoConcluir.innerHTML = "Concluir";
    }
}
function createModalAndNoteContainer() {
    if (userInfos.notes.length > 0) return;
    main.innerHTML = `
  <div class="iconizao">
  <i data-bs-toggle="modal" data-bs-target="#exampleModal" class="bi cp bi-clipboard-plus"></i>
  <span data-bs-toggle="modal" data-bs-target="#exampleModal" class="cp">Nova tarefa</span>
</div>
`;
}
